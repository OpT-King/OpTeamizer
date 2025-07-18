import { Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

export function ResultModal({ isOpen, type, title, message, onClose }: ResultModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="text-white" size={24} />;
      case 'error':
        return <X className="text-white" size={24} />;
      default:
        return <Info className="text-white" size={24} />;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <div className="text-center">
          <div className={`w-16 h-16 ${getIconColor()} rounded-lg flex items-center justify-center mx-auto mb-4`}>
            {getIcon()}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-6" dangerouslySetInnerHTML={{ __html: message }}></p>
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
