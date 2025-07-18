import { Cpu, HardDrive, Wifi, Star } from "lucide-react";
import { useSystemMetrics } from "@/hooks/use-system-metrics";

const statsConfig = [
  {
    icon: Cpu,
    label: "Uso da CPU",
    key: "cpuUsage" as const,
    suffix: "%",
    color: "blue",
  },
  {
    icon: HardDrive,
    label: "Memória RAM",
    key: "memoryUsage" as const,
    suffix: "",
    color: "green",
  },
  {
    icon: Wifi,
    label: "Velocidade Rede",
    key: "networkSpeed" as const,
    suffix: "",
    color: "purple",
  },
  {
    icon: Star,
    label: "Score Otimização",
    key: "optimizationScore" as const,
    suffix: "%",
    color: "yellow",
  },
];

export function SystemStats() {
  const { data: metrics, isLoading } = useSystemMetrics();

  if (isLoading) {
    return (
      <section className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-700 animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gray-800 border-b border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          const value = metrics ? metrics[stat.key] : 0;
          const displayValue = typeof value === "string" ? value : `${value}${stat.suffix}`;
          const percentage = typeof value === "number" ? value : parseInt(value) || 0;

          return (
            <div key={stat.key} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{displayValue}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-300 progress-bar-animation`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
