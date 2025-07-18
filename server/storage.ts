import { optimizationLogs, systemMetrics, type OptimizationLog, type InsertOptimizationLog, type SystemMetrics, type InsertSystemMetrics } from "@shared/schema";

export interface IStorage {
  createOptimizationLog(log: InsertOptimizationLog): Promise<OptimizationLog>;
  getRecentOptimizationLogs(limit: number): Promise<OptimizationLog[]>;
  createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
  getLatestSystemMetrics(): Promise<SystemMetrics | undefined>;
}

export class MemStorage implements IStorage {
  private optimizationLogs: Map<number, OptimizationLog>;
  private systemMetrics: Map<number, SystemMetrics>;
  private currentLogId: number;
  private currentMetricsId: number;

  constructor() {
    this.optimizationLogs = new Map();
    this.systemMetrics = new Map();
    this.currentLogId = 1;
    this.currentMetricsId = 1;
  }

  async createOptimizationLog(insertLog: InsertOptimizationLog): Promise<OptimizationLog> {
    const id = this.currentLogId++;
    const log: OptimizationLog = {
      ...insertLog,
      id,
      executedAt: new Date(),
    };
    this.optimizationLogs.set(id, log);
    return log;
  }

  async getRecentOptimizationLogs(limit: number): Promise<OptimizationLog[]> {
    const logs = Array.from(this.optimizationLogs.values())
      .sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())
      .slice(0, limit);
    return logs;
  }

  async createSystemMetrics(insertMetrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const id = this.currentMetricsId++;
    const metrics: SystemMetrics = {
      ...insertMetrics,
      id,
      recordedAt: new Date(),
    };
    this.systemMetrics.set(id, metrics);
    return metrics;
  }

  async getLatestSystemMetrics(): Promise<SystemMetrics | undefined> {
    const metrics = Array.from(this.systemMetrics.values())
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())[0];
    return metrics;
  }
}

export const storage = new MemStorage();
