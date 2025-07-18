import type { Express } from "express";
import { createServer, type Server } from "http";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { scriptExecutionSchema } from "@shared/schema";
import { z } from "zod";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Execute single script
  app.post("/api/scripts/execute", async (req, res) => {
    try {
      const { scriptName } = scriptExecutionSchema.parse(req.body);
      
      const basePath = path.join(process.cwd(), 'scripts');
      const extensions = ['.bat', '.reg', '.exe'];
      let scriptPath = '';
      let command = '';

      // Find the script file
      for (const ext of extensions) {
        const possiblePath = path.join(basePath, scriptName + ext);
        if (fs.existsSync(possiblePath)) {
          scriptPath = possiblePath;
          if (ext === '.bat') {
            command = process.platform === 'win32' 
              ? `cmd /c "${scriptPath}"` 
              : `echo "Windows batch file detected but running on ${process.platform}"`;
          } else if (ext === '.reg') {
            command = process.platform === 'win32'
              ? `regedit /s "${scriptPath}"`
              : `echo "Registry file detected but running on ${process.platform}"`;
          } else if (ext === '.exe') {
            command = process.platform === 'win32'
              ? `start "" "${scriptPath}"`
              : `echo "Executable detected but running on ${process.platform}"`;
          }
          break;
        }
      }

      if (!scriptPath) {
        await storage.createOptimizationLog({
          scriptName,
          status: 'error',
          message: `Script ${scriptName} não encontrado`,
        });
        
        return res.status(404).json({
          success: false,
          message: `❌ Script ${scriptName} não encontrado.`,
          scriptName,
        });
      }

      try {
        // For demo purposes on non-Windows platforms, we'll simulate success
        if (process.platform !== 'win32') {
          await storage.createOptimizationLog({
            scriptName,
            status: 'success',
            message: `Script ${scriptName} simulado com sucesso (plataforma: ${process.platform})`,
          });
          
          return res.json({
            success: true,
            message: `✅ Script ${scriptName} executado com sucesso! (Simulado em ${process.platform})`,
            scriptName,
          });
        }

        const { stdout, stderr } = await execAsync(command);
        
        await storage.createOptimizationLog({
          scriptName,
          status: 'success',
          message: stdout || `Script ${scriptName} executado com sucesso`,
        });

        res.json({
          success: true,
          message: `✅ Script ${scriptName} executado com sucesso!`,
          scriptName,
        });
      } catch (error: any) {
        await storage.createOptimizationLog({
          scriptName,
          status: 'error',
          message: error.message,
        });

        res.status(500).json({
          success: false,
          message: `❌ Erro ao executar ${scriptName}: ${error.message}`,
          scriptName,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Execute multiple scripts
  app.post("/api/scripts/execute-batch", async (req, res) => {
    try {
      const { scripts } = z.object({ scripts: z.array(z.string()) }).parse(req.body);
      
      const results = [];
      
      for (const scriptName of scripts) {
        const basePath = path.join(process.cwd(), 'scripts');
        const extensions = ['.bat', '.reg', '.exe'];
        let scriptPath = '';
        let command = '';

        // Find the script file
        for (const ext of extensions) {
          const possiblePath = path.join(basePath, scriptName + ext);
          if (fs.existsSync(possiblePath)) {
            scriptPath = possiblePath;
            if (ext === '.bat') {
              command = process.platform === 'win32' 
                ? `cmd /c "${scriptPath}"` 
                : `echo "Windows batch file detected but running on ${process.platform}"`;
            } else if (ext === '.reg') {
              command = process.platform === 'win32'
                ? `regedit /s "${scriptPath}"`
                : `echo "Registry file detected but running on ${process.platform}"`;
            } else if (ext === '.exe') {
              command = process.platform === 'win32'
                ? `start "" "${scriptPath}"`
                : `echo "Executable detected but running on ${process.platform}"`;
            }
            break;
          }
        }

        if (!scriptPath) {
          await storage.createOptimizationLog({
            scriptName,
            status: 'error',
            message: `Script ${scriptName} não encontrado`,
          });
          
          results.push({
            success: false,
            message: `❌ Script ${scriptName} não encontrado.`,
            scriptName,
          });
          continue;
        }

        try {
          // For demo purposes on non-Windows platforms, we'll simulate success
          if (process.platform !== 'win32') {
            await storage.createOptimizationLog({
              scriptName,
              status: 'success',
              message: `Script ${scriptName} simulado com sucesso (plataforma: ${process.platform})`,
            });
            
            results.push({
              success: true,
              message: `✅ Script ${scriptName} executado com sucesso! (Simulado)`,
              scriptName,
            });
            continue;
          }

          const { stdout, stderr } = await execAsync(command);
          
          await storage.createOptimizationLog({
            scriptName,
            status: 'success',
            message: stdout || `Script ${scriptName} executado com sucesso`,
          });

          results.push({
            success: true,
            message: `✅ Script ${scriptName} executado com sucesso!`,
            scriptName,
          });
        } catch (error: any) {
          await storage.createOptimizationLog({
            scriptName,
            status: 'error',
            message: error.message,
          });

          results.push({
            success: false,
            message: `❌ Erro ao executar ${scriptName}: ${error.message}`,
            scriptName,
          });
        }
      }

      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get system metrics
  app.get("/api/system/metrics", async (req, res) => {
    try {
      // Simulate system metrics since we can't get real ones cross-platform
      const metrics = {
        cpuUsage: Math.floor(Math.random() * 40) + 15, // 15-55%
        memoryUsage: (Math.random() * 4 + 6).toFixed(1) + 'GB', // 6-10GB
        networkSpeed: Math.floor(Math.random() * 50) + 50 + ' Mbps', // 50-100 Mbps
        optimizationScore: Math.floor(Math.random() * 20) + 80, // 80-100%
      };

      await storage.createSystemMetrics({
        cpuUsage: parseInt(metrics.cpuUsage.toString()),
        memoryUsage: metrics.memoryUsage,
        networkSpeed: metrics.networkSpeed,
        optimizationScore: metrics.optimizationScore,
      });

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to get system metrics" });
    }
  });

  // Get recent activity logs
  app.get("/api/logs/recent", async (req, res) => {
    try {
      const logs = await storage.getRecentOptimizationLogs(10);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
