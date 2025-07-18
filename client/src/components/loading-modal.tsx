import { Settings } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
  progress: number;
  currentTask: string;
}

export function LoadingModal({ isOpen, progress, currentTask }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="text-white animate-spin" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Executando Otimização</h3>
          <p className="text-gray-400 mb-4">Por favor, aguarde enquanto aplicamos as otimizações...</p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 progress-bar-animation"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{currentTask}</p>
        </div>
      </div>
    </div>
  );
}
