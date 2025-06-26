export interface BatteryData {
  academyId: number;
  batteryLevel: number;
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface DeviceBatteryInfo {
  serialNumber: string;
  dailyConsumption: number | 'unknown';
  isUnhealthy: boolean;
  lastBatteryLevel: number;
  lastTimestamp: string;
}

export interface SchoolBatterySummary {
  academyId: number;
  devices: DeviceBatteryInfo[];
  unhealthyCount: number;
}
