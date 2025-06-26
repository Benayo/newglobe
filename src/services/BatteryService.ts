import type { BatteryData, DeviceBatteryInfo, SchoolBatterySummary } from '@/types';

export class BatteryService {
  async fetchBatteryData(): Promise<BatteryData[]> {
    try {
      const response = await fetch('/data/battery.json');
      if (!response.ok) {
        console.log('Response status:', response.status, 'Response URL:', response.url);
        const text = await response.text();
        console.log('Response body:', text.slice(0, 100));
        throw new Error('Failed to fetch battery data');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Expected an array of BatteryData');
      }
      data.forEach((item, index) => {
        if (
          typeof item.academyId !== 'number' ||
          typeof item.batteryLevel !== 'number' ||
          typeof item.employeeId !== 'string' ||
          typeof item.serialNumber !== 'string' ||
          typeof item.timestamp !== 'string'
        ) {
          throw new Error(`Invalid BatteryData at index ${index}`);
        }
      });
      return data as BatteryData[];
    } catch (error) {
      console.error('Error fetching battery data:', error);
      throw error;
    }
  }

  calculateBatteryConsumption(data: BatteryData[]): SchoolBatterySummary[] {
    const byAcademy = new Map<number, BatteryData[]>();
    data.forEach((entry) => {
      if (!byAcademy.has(entry.academyId)) {
        byAcademy.set(entry.academyId, []);
      }
      byAcademy.get(entry.academyId)!.push(entry);
    });

    const summaries: SchoolBatterySummary[] = [];

    for (const [academyId, entries] of byAcademy) {
      const byDevice = new Map<string, BatteryData[]>();
      entries.forEach((entry) => {
        if (!byDevice.has(entry.serialNumber)) {
          byDevice.set(entry.serialNumber, []);
        }
        byDevice.get(entry.serialNumber)!.push(entry);
      });

      const devices: DeviceBatteryInfo[] = [];

      for (const [serialNumber, deviceData] of byDevice) {
        if (deviceData.length < 2) {
          devices.push({
            serialNumber,
            dailyConsumption: 'unknown',
            isUnhealthy: false,
            lastBatteryLevel: deviceData[0].batteryLevel,
            lastTimestamp: deviceData[0].timestamp
          });
          continue;
        }

        deviceData.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        let totalConsumption = 0;
        let totalHours = 0;

        for (let i = 1; i < deviceData.length; i++) {
          const prev = deviceData[i - 1];
          const curr = deviceData[i];
          const prevTime = new Date(prev.timestamp).getTime();
          const currTime = new Date(curr.timestamp).getTime();
          const hours = (currTime - prevTime) / (1000 * 60 * 60);

          if (curr.batteryLevel >= prev.batteryLevel) continue;

          const consumption = prev.batteryLevel - curr.batteryLevel;
          totalConsumption += consumption;
          totalHours += hours;
          console.log(`Device ${serialNumber}: consumption=${consumption}, hours=${hours}`);
        }

        const dailyConsumption = totalHours > 0 ? (totalConsumption / totalHours) * 24 : 'unknown';
        const isUnhealthy = dailyConsumption !== 'unknown' && dailyConsumption > 0.3;
        console.log(
          `Device ${serialNumber}: dailyConsumption=${dailyConsumption}, isUnhealthy=${isUnhealthy}`
        );

        devices.push({
          serialNumber,
          dailyConsumption:
            dailyConsumption === 'unknown' ? 'unknown' : Number(dailyConsumption.toFixed(3)),
          isUnhealthy,
          lastBatteryLevel: deviceData[deviceData.length - 1].batteryLevel,
          lastTimestamp: deviceData[deviceData.length - 1].timestamp
        });
      }

      const unhealthyCount = devices.filter((d) => d.isUnhealthy).length;
      console.log(`Academy ${academyId} unhealthyCount:`, unhealthyCount);
      summaries.push({
        academyId,
        devices,
        unhealthyCount
      });
    }

    return summaries.sort((a, b) => b.unhealthyCount - a.unhealthyCount);
  }
}

export const batteryService = new BatteryService();
