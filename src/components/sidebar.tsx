import { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Kanban,
  Send,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FolderKanban
} from 'lucide-react';
import type { UserRole } from '../App';

interface SidebarProps {
  currentRole: UserRole;
  currentView: string;
  onViewChange: (view: string) => void;
  onRoleChange: () => void;
  companyType?: 'saas' | 'vendas';
}

export function Sidebar({ currentRole, currentView, onViewChange, onRoleChange, companyType = 'vendas' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminSaasMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companies', label: 'Empresas', icon: Building2 },
    { id: 'packages', label: 'Pacotes', icon: Package },
    { id: 'billing', label: 'Faturamento', icon: CreditCard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const adminEmpresaMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'n8n', label: 'Integração n8n', icon: Settings },
    { id: 'kanban', label: 'CRM Kanban', icon: Kanban },
    ...(companyType === 'saas' ? [{ id: 'projects', label: 'Projetos', icon: FolderKanban }] : []),
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const userMenu = [
    { id: 'kanban', label: 'CRM Kanban', icon: Kanban },
    { id: 'campaigns', label: 'Campanhas', icon: Send },
    { id: 'dashboard', label: 'Relatórios', icon: BarChart3 },
    ...(companyType === 'saas' ? [{ id: 'projects', label: 'Projetos', icon: FolderKanban }] : []),
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin-saas':
        return adminSaasMenu;
      case 'admin-empresa':
        return adminEmpresaMenu;
      case 'user':
        return userMenu;
      default:
        return [];
    }
  };

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'admin-saas':
        return 'Admin SaaS';
      case 'admin-empresa':
        return 'Admin Empresa';
      case 'user':
        return 'Usuário';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">CRM SaaS</h2>
              <p className="text-sm text-sidebar-foreground/70">{getRoleLabel()}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="p-2">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-1 text-sidebar-foreground hover:bg-sidebar-accent ${
                isCollapsed ? 'px-2' : 'px-3'
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-2 right-2">
        <Separator className="bg-sidebar-border mb-2" />
        <Button
          variant="ghost"
          className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
            isCollapsed ? 'px-2' : 'px-3'
          }`}
          onClick={onRoleChange}
        >
          <RotateCcw className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Trocar Papel</span>}
        </Button>
      </div>
    </div>
  );
}