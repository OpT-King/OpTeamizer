import { apiRequest } from "./queryClient";

export interface ScriptResult {
  success: boolean;
  message: string;
  scriptName: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: string;
  networkSpeed: string;
  optimizationScore: number;
}

export const optimizerApi = {
  async executeScript(scriptName: string): Promise<ScriptResult> {
    const response = await apiRequest("POST", "/api/scripts/execute", { scriptName });
    return response.json();
  },

  async executeMultipleScripts(scripts: string[]): Promise<ScriptResult[]> {
    const response = await apiRequest("POST", "/api/scripts/execute-batch", { scripts });
    return response.json();
  },

  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await apiRequest("GET", "/api/system/metrics");
    return response.json();
  },

  async getRecentActivity(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/logs/recent");
    return response.json();
  },
};
