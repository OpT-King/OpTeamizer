import { Rocket, Gauge, Settings, Network, Shield, User } from "lucide-react";

const navigationItems = [
  { icon: Gauge, label: "Dashboard", href: "/", active: true },
  { icon: Rocket, label: "Performance", href: "/performance", active: false },
  { icon: Settings, label: "Sistema", href: "/system", active: false },
  { icon: Network, label: "Rede", href: "/network", active: false },
  { icon: Shield, label: "Segurança", href: "/security", active: false },
];

export function Sidebar() {
  return (
    <aside className="w-18 lg:w-72 bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Rocket className="text-white" size={20} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white">Kideuss</h1>
            <p className="text-xs text-gray-400">Optimizer Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="hidden lg:block">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="text-gray-300" size={16} />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white">Administrator</p>
            <p className="text-xs text-gray-400">Sistema Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
