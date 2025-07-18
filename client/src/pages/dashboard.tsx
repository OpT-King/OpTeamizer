import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  Gamepad2, 
  Ban, 
  Network, 
  Wrench,
  Save,
  Undo,
  Rocket,
  HardDrive,
  Zap,
  Settings,
  Cpu,
  StopCircle,
  X,
  Unlock,
  Minimize2,
  Gauge,
  Radio,
  Clock,
  Download,
  AlertCircle,
  Info
} from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { SystemStats } from "@/components/system-stats";
import { OptimizationCard } from "@/components/optimization-card";
import { ActivityLog } from "@/components/activity-log";
import { LoadingModal } from "@/components/loading-modal";
import { ResultModal } from "@/components/result-modal";
import { Button } from "@/components/ui/button";
import { optimizerApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [loadingState, setLoadingState] = useState({
    isOpen: false,
    progress: 0,
    currentTask: "",
  });
  
  const [resultState, setResultState] = useState({
    isOpen: false,
    type: 'info' as 'success' | 'error' | 'info',
    title: "",
    message: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const executeScriptMutation = useMutation({
    mutationFn: optimizerApi.executeScript,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs/recent"] });
      setResultState({
        isOpen: true,
        type: result.success ? 'success' : 'error',
        title: result.success ? 'Sucesso!' : 'Erro!',
        message: result.message,
      });
    },
    onError: (error) => {
      setResultState({
        isOpen: true,
        type: 'error',
        title: 'Erro!',
        message: `Erro ao executar script: ${error.message}`,
      });
    },
  });

  const executeBatchMutation = useMutation({
    mutationFn: optimizerApi.executeMultipleScripts,
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs/recent"] });
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      setResultState({
        isOpen: true,
        type: successCount === totalCount ? 'success' : 'error',
        title: 'Concluído!',
        message: `${successCount} de ${totalCount} otimizações foram aplicadas com sucesso.`,
      });
    },
    onError: (error) => {
      setResultState({
        isOpen: true,
        type: 'error',
        title: 'Erro!',
        message: `Erro ao executar scripts: ${error.message}`,
      });
    },
  });

  const handleExecuteScript = (scriptName: string) => {
    setLoadingState({
      isOpen: true,
      progress: 50,
      currentTask: `Executando ${scriptName}...`,
    });
    
    executeScriptMutation.mutate(scriptName, {
      onSettled: () => {
        setLoadingState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleExecuteAll = async (scripts: string[]) => {
    setLoadingState({
      isOpen: true,
      progress: 0,
      currentTask: `Iniciando (0/${scripts.length})...`,
    });

    // Simulate progress updates
    for (let i = 0; i <= scripts.length; i++) {
      const progress = (i / scripts.length) * 100;
      const currentTask = i < scripts.length 
        ? `Executando ${scripts[i]} (${i + 1}/${scripts.length})...`
        : 'Finalizando...';
      
      setLoadingState(prev => ({
        ...prev,
        progress,
        currentTask,
      }));

      if (i < scripts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    executeBatchMutation.mutate(scripts, {
      onSettled: () => {
        setLoadingState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'restore':
        handleExecuteScript('create_restore_point');
        break;
      case 'info':
        setResultState({
          isOpen: true,
          type: 'info',
          title: 'Informações do Sistema',
          message: 'CPU: Intel Core i7-10700K<br>RAM: 16GB DDR4<br>GPU: NVIDIA RTX 3070<br>Sistema: Windows 11 Pro',
        });
        break;
      case 'full':
        const allScripts = [
          'create_restore_point',
          'boost_fps', 'memory_boost', 'disable_throttling', 'ram_16gb',
          'disable_services', 'disable_extra_services',
          'network_limit', 'disable_background_apps', 'reduce_network_delay', 'latency_tolerance'
        ];
        handleExecuteAll(allScripts);
        break;
    }
  };

  const optimizationCategories = [
    {
      title: "Segurança do Sistema",
      description: "Proteja e restaure seu sistema",
      icon: <Shield className="mr-3" size={20} />,
      color: "yellow",
      scripts: [
        { name: "create_restore_point", label: "Criar Ponto de Restauração", icon: <Save className="text-yellow-400" size={16} /> },
        { name: "launch_restore", label: "Restaurar Sistema", icon: <Undo className="text-red-400" size={16} /> },
      ],
    },
    {
      title: "Boost de FPS",
      description: "Otimize performance para jogos",
      icon: <Gamepad2 className="mr-3" size={20} />,
      color: "blue",
      scripts: [
        { name: "boost_fps", label: "Aplicar Boost FPS", icon: <Rocket className="text-blue-400" size={16} /> },
        { name: "memory_boost", label: "Melhorar Memória", icon: <HardDrive className="text-blue-400" size={16} /> },
        { name: "disable_throttling", label: "Desativar Power Throttling", icon: <Zap className="text-blue-400" size={16} /> },
        { name: "ram_16gb", label: "Ajustar para 16GB RAM", icon: <Cpu className="text-blue-400" size={16} /> },
      ],
    },
    {
      title: "Desativar Serviços",
      description: "Remova serviços desnecessários",
      icon: <Ban className="mr-3" size={20} />,
      color: "pink",
      scripts: [
        { name: "disable_services", label: "Desativar Serviços", icon: <StopCircle className="text-pink-400" size={16} /> },
        { name: "disable_extra_services", label: "Desativar Serviços Extras", icon: <X className="text-pink-400" size={16} /> },
      ],
    },
    {
      title: "Otimização de Rede",
      description: "Melhore velocidade e latência",
      icon: <Network className="mr-3" size={20} />,
      color: "purple",
      scripts: [
        { name: "network_limit", label: "Remover Limitação", icon: <Unlock className="text-purple-400" size={16} /> },
        { name: "disable_background_apps", label: "Fechar Apps em Segundo Plano", icon: <Minimize2 className="text-purple-400" size={16} /> },
        { name: "reduce_network_delay", label: "Reduzir Delay", icon: <Gauge className="text-purple-400" size={16} /> },
        { name: "latency_tolerance", label: "Tolerância de Latência", icon: <Radio className="text-purple-400" size={16} /> },
      ],
    },
  ];

  const toolsScripts = [
    { name: "measure_sleep", label: "Medir Sleep Timer", icon: <Clock className="text-gray-400" size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard de Otimização</h1>
              <p className="text-gray-400 text-sm">Gerencie e otimize seu sistema Windows</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-900 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Sistema OK</span>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <AlertCircle size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
            </div>
          </div>
        </header>

        {/* System Stats */}
        <SystemStats />

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleQuickAction('restore')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Criar Ponto de Restauração</span>
              </Button>
              <Button
                onClick={() => handleQuickAction('info')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Info size={16} />
                <span>Informações do Sistema</span>
              </Button>
              <Button
                onClick={() => handleQuickAction('full')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Rocket size={16} />
                <span>Otimização Completa</span>
              </Button>
            </div>
          </section>

          {/* Optimization Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {optimizationCategories.map((category) => (
              <OptimizationCard
                key={category.title}
                title={category.title}
                description={category.description}
                icon={category.icon}
                color={category.color}
                scripts={category.scripts}
                onExecuteScript={handleExecuteScript}
                onExecuteAll={handleExecuteAll}
                isLoading={executeScriptMutation.isPending || executeBatchMutation.isPending}
              />
            ))}
          </div>

          {/* Tools Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Wrench className="mr-3" size={20} />
                Ferramentas do Sistema
              </h3>
              <p className="text-gray-200 text-sm mt-1">Utilitários avançados de diagnóstico</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {toolsScripts.map((script) => (
                  <Button
                    key={script.name}
                    variant="ghost"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group optimization-button"
                    onClick={() => handleExecuteScript(script.name)}
                    disabled={executeScriptMutation.isPending}
                  >
                    <span className="flex items-center space-x-2">
                      {script.icon}
                      <span>{script.label}</span>
                    </span>
                  </Button>
                ))}
              </div>
              <Button
                className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                onClick={() => handleExecuteAll(toolsScripts.map(s => s.name))}
                disabled={executeScriptMutation.isPending || executeBatchMutation.isPending}
              >
                <Settings size={16} />
                <span>Aplicar Todas - Ferramentas</span>
              </Button>
            </div>
          </div>

          {/* Activity Log */}
          <ActivityLog />
        </div>
      </main>

      {/* Modals */}
      <LoadingModal
        isOpen={loadingState.isOpen}
        progress={loadingState.progress}
        currentTask={loadingState.currentTask}
      />
      
      <ResultModal
        isOpen={resultState.isOpen}
        type={resultState.type}
        title={resultState.title}
        message={resultState.message}
        onClose={() => setResultState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
