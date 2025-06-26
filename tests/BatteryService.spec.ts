import { describe, it, expect } from 'vitest';
import { BatteryService } from '@/services/BatteryService';
import type { BatteryData, SchoolBatterySummary } from '@/types';

describe('BatteryService', () => {
  const service = new BatteryService();

  it('handles single data point (unknown consumption)', () => {
    const data: BatteryData[] = [
      {
        academyId: 1,
        batteryLevel: 0.8,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T00:00:00Z'
      }
    ];
    const result = service.calculateBatteryConsumption(data);
    expect(result).toEqual([
      {
        academyId: 1,
        devices: [
          {
            serialNumber: 'D1',
            dailyConsumption: 'unknown',
            isUnhealthy: false,
            lastBatteryLevel: 0.8,
            lastTimestamp: '2021-01-01T00:00:00Z'
          }
        ],
        unhealthyCount: 0
      }
    ]);
  });

  it('calculates consumption with two points in 12 hours', () => {
    const data: BatteryData[] = [
      {
        academyId: 1,
        batteryLevel: 1.0,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T09:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.9,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T21:00:00Z'
      }
    ];
    const result = service.calculateBatteryConsumption(data);
    const device = result[0].devices[0];
    expect(device.dailyConsumption).toBeCloseTo(0.2, 3); // 10% over 12 hours = 20% daily
    expect(device.isUnhealthy).toBe(false);
  });

  it('ignores battery level increases (charges)', () => {
    const data: BatteryData[] = [
      {
        academyId: 1,
        batteryLevel: 1.0,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T09:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.8,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-02T09:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 1.0,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-02T10:00:00Z'
      }
    ];
    const result = service.calculateBatteryConsumption(data);
    const device = result[0].devices[0];
    expect(device.dailyConsumption).toBeCloseTo(0.2, 3); // 20% over 24 hours
    expect(device.isUnhealthy).toBe(false);
  });

  it('flags unhealthy devices (>30% daily)', () => {
    const data: BatteryData[] = [
      {
        academyId: 1,
        batteryLevel: 1.0,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T09:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.6,
        employeeId: 'E1',
        serialNumber: 'D1',
        timestamp: '2021-01-01T21:00:00Z'
      }
    ];
    const result = service.calculateBatteryConsumption(data);
    const device = result[0].devices[0];
    expect(device.dailyConsumption).toBeCloseTo(0.8, 3); // 40% over 12 hours = 80% daily
    expect(device.isUnhealthy).toBe(true);
  });
});
