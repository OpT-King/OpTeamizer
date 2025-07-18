import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const optimizationLogs = pgTable("optimization_logs", {
  id: serial("id").primaryKey(),
  scriptName: text("script_name").notNull(),
  status: text("status").notNull(), // 'success', 'error', 'running'
  message: text("message"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  cpuUsage: integer("cpu_usage").notNull(),
  memoryUsage: text("memory_usage").notNull(),
  networkSpeed: text("network_speed").notNull(),
  optimizationScore: integer("optimization_score").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const insertOptimizationLogSchema = createInsertSchema(optimizationLogs).omit({
  id: true,
  executedAt: true,
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  recordedAt: true,
});

export type InsertOptimizationLog = z.infer<typeof insertOptimizationLogSchema>;
export type OptimizationLog = typeof optimizationLogs.$inferSelect;

export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
export type SystemMetrics = typeof systemMetrics.$inferSelect;

// Script execution request schema
export const scriptExecutionSchema = z.object({
  scriptName: z.string().min(1),
  scripts: z.array(z.string()).optional(), // For batch execution
});

export type ScriptExecution = z.infer<typeof scriptExecutionSchema>;
