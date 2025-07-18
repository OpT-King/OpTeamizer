import { Check, X, Info, Clock } from "lucide-react";
import { useRecentActivity } from "@/hooks/use-system-metrics";

interface ActivityItem {
  id: number;
  scriptName: string;
  status: string;
  message?: string;
  executedAt: string;
}

export function ActivityLog() {
  const { data: activities = [], isLoading } = useRecentActivity();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="text-white" size={16} />;
      case 'error':
        return <X className="text-white" size={16} />;
      default:
        return <Info className="text-white" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'blue';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Sucesso';
      case 'error':
        return 'Erro';
      default:
        return 'Concluído';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'há alguns segundos';
    if (diffInMinutes === 1) return 'há 1 minuto';
    if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return 'há 1 hora';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    
    return date.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Atividade Recente</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b border-gray-700 animate-pulse">
                <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Atividade Recente</h2>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400">Nenhuma atividade recente</p>
              <p className="text-gray-500 text-sm">Execute algumas otimizações para ver o histórico aqui</p>
            </div>
          ) : (
            activities.map((activity: ActivityItem) => {
              const statusColor = getStatusColor(activity.status);
              return (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 py-3 border-b border-gray-700 last:border-b-0"
                >
                  <div className={`w-10 h-10 bg-${statusColor}-600 rounded-lg flex items-center justify-center`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.scriptName} executado</p>
                    <p className="text-gray-400 text-sm">
                      Executado {formatTimeAgo(activity.executedAt)}
                    </p>
                    {activity.message && (
                      <p className="text-gray-500 text-xs mt-1">{activity.message}</p>
                    )}
                  </div>
                  <span className={`text-${statusColor}-400 text-sm font-medium`}>
                    {getStatusText(activity.status)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
