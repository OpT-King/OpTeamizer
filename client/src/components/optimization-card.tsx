import { ReactNode } from "react";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptimizationScript {
  name: string;
  label: string;
  icon: ReactNode;
}

interface OptimizationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  scripts: OptimizationScript[];
  onExecuteScript: (scriptName: string) => void;
  onExecuteAll: (scripts: string[]) => void;
  isLoading?: boolean;
}

export function OptimizationCard({
  title,
  description,
  icon,
  color,
  scripts,
  onExecuteScript,
  onExecuteAll,
  isLoading = false,
}: OptimizationCardProps) {
  const handleExecuteAll = () => {
    const scriptNames = scripts.map(script => script.name);
    onExecuteAll(scriptNames);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className={`bg-${color}-600 px-6 py-4`}>
        <h3 className="text-xl font-semibold text-white flex items-center">
          {icon}
          {title}
        </h3>
        <p className={`text-${color}-100 text-sm mt-1`}>{description}</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {scripts.map((script) => (
            <Button
              key={script.name}
              variant="ghost"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group optimization-button"
              onClick={() => onExecuteScript(script.name)}
              disabled={isLoading}
            >
              <span className="flex items-center space-x-2">
                {script.icon}
                <span>{script.label}</span>
              </span>
              <ChevronRight className="text-gray-400 group-hover:text-white transition-colors" size={16} />
            </Button>
          ))}
        </div>
        <Button
          className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
          onClick={handleExecuteAll}
          disabled={isLoading}
        >
          <Play size={16} />
          <span>Aplicar Todas - {title}</span>
        </Button>
      </div>
    </div>
  );
}
