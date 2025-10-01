import { useState } from 'react';
import { Sidebar } from './components/sidebar';
import { AdminSaasDashboard } from './components/admin-saas-dashboard';
import { AdminEmpresaDashboard } from './components/admin-empresa-dashboard';
import { UserDashboard } from './components/user-dashboard';
import { CompanyManagement } from './components/company-management';
import { PackageManagement } from './components/package-management';
import { BillingManagement } from './components/billing-management';
import { UserManagement } from './components/user-management';
import { WhatsAppConnections } from './components/whatsapp-connections';
import { N8nIntegration } from './components/n8n-integration';
import { KanbanCRM } from './components/kanban-crm';
import { LeadDetails } from './components/lead-details';
import { CampaignDispatch } from './components/campaign-dispatch';
import { AgendaManagement } from './components/agenda-management';
import { AgendaNotifications } from './components/agenda-notifications';
import { ProjectManagement } from './components/project-management';
import { ProjectKanban } from './components/project-kanban';
import { RoleSelector } from './components/role-selector';
import { Button } from './components/ui/button';
import { Moon, Sun } from 'lucide-react';

export type UserRole = 'admin-saas' | 'admin-empresa' | 'user';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  status: 'novo' | 'qualificacao' | 'proposta' | 'concluida' | 'perdida';
  budgetValue: number;
  saleValue?: number;
  responsible: string;
  tags: string[];
  leadScore: 'quente' | 'morno' | 'frio';
  lastContact: string;
  notes: string;
}

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  
  // Mock company type - in real app, this would come from user/company context
  const [companyType] = useState<'saas' | 'vendas'>('saas');

  // Mock leads data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'João Silva',
      phone: '+55 11 99999-0001',
      status: 'novo',
      budgetValue: 5000,
      responsible: 'Ana Costa',
      tags: ['VIP', 'Primeira Compra'],
      leadScore: 'quente',
      lastContact: '2024-01-15',
      notes: 'Cliente interessado em serviço premium'
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '+55 11 99999-0002',
      status: 'qualificacao',
      budgetValue: 8000,
      responsible: 'Carlos Oliveira',
      tags: ['Corporativo'],
      leadScore: 'morno',
      lastContact: '2024-01-14',
      notes: 'Aguardando aprovação do orçamento'
    },
    {
      id: '3',
      name: 'Pedro Almeida',
      phone: '+55 11 99999-0003',
      status: 'proposta',
      budgetValue: 12000,
      responsible: 'Ana Costa',
      tags: ['Enterprise'],
      leadScore: 'quente',
      lastContact: '2024-01-13',
      notes: 'Proposta enviada, aguardando retorno'
    },
    {
      id: '4',
      name: 'Carla Ferreira',
      phone: '+55 11 99999-0004',
      status: 'concluida',
      budgetValue: 7500,
      saleValue: 7500,
      responsible: 'Carlos Oliveira',
      tags: ['Recorrente'],
      leadScore: 'quente',
      lastContact: '2024-01-12',
      notes: 'Venda concluída com sucesso'
    }
  ]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  if (currentView === 'role-selector') {
    return (
      <div className={isDark ? 'dark' : ''}>
        <RoleSelector onRoleSelect={setCurrentRole} onViewChange={setCurrentView} />
      </div>
    );
  }

  const renderCurrentView = () => {
    if (selectedLead && currentView === 'lead-details') {
      return (
        <LeadDetails 
          lead={selectedLead} 
          onBack={() => {
            setSelectedLead(null);
            setCurrentView('kanban');
          }}
          onUpdateLead={(updatedLead) => {
            setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            setSelectedLead(updatedLead);
          }}
        />
      );
    }

    if (selectedProject && currentView === 'project-tasks') {
      // Mock project data - in real app, this would be fetched based on selectedProject
      const mockProject = {
        id: selectedProject,
        name: selectedProject === '1' ? 'Sistema ERP MRS' : 
              selectedProject === '2' ? 'PDV Maui' : 'Aplicativo Mobile',
        description: 'Projeto selecionado para visualização das tarefas'
      };
      
      return (
        <ProjectKanban 
          project={mockProject}
          onBack={() => {
            setSelectedProject(null);
            setCurrentView('projects');
          }}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        if (currentRole === 'admin-saas') return <AdminSaasDashboard />;
        if (currentRole === 'admin-empresa') return <AdminEmpresaDashboard onNavigate={setCurrentView} companyType={companyType} />;
        return <UserDashboard onNavigate={setCurrentView} companyType={companyType} />;
      
      case 'companies':
        return <CompanyManagement />;
      
      case 'packages':
        return <PackageManagement />;
      
      case 'billing':
        return <BillingManagement />;
      
      case 'users':
        return <UserManagement />;
      
      case 'whatsapp':
        return <WhatsAppConnections />;
      
      case 'n8n':
        return <N8nIntegration />;
      
      case 'kanban':
        return (
          <KanbanCRM 
            leads={leads}
            onUpdateLead={(updatedLead) => {
              setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            }}
            onSelectLead={(lead) => {
              setSelectedLead(lead);
              setCurrentView('lead-details');
            }}
          />
        );
      
      case 'campaigns':
        return <CampaignDispatch />;
      
      case 'agenda':
        return <AgendaManagement />;
      
      case 'projects':
        return (
          <ProjectManagement 
            onProjectSelect={(projectId) => {
              setSelectedProject(projectId);
              setCurrentView('project-tasks');
            }}
          />
        );
      
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex h-screen bg-background">
        <Sidebar 
          currentRole={currentRole}
          currentView={currentView}
          onViewChange={setCurrentView}
          onRoleChange={() => setCurrentView('role-selector')}
          companyType={companyType}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card p-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">
                {currentRole === 'admin-saas' && 'Admin SaaS'}
                {currentRole === 'admin-empresa' && 'Admin Empresa'}
                {currentRole === 'user' && 'CRM WhatsApp'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <AgendaNotifications />
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto bg-background">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  );
}