import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Target, Clock, DollarSign, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { AgendaWidget } from './agenda-widget';
import { ProjectWidget } from './project-widget';

interface UserDashboardProps {
  onNavigate?: (view: string) => void;
  companyType?: 'saas' | 'vendas';
}

export function UserDashboard({ onNavigate, companyType = 'vendas' }: UserDashboardProps = {}) {
  const performanceData = [
    { day: 'Seg', contacts: 12, leads: 8, sales: 2 },
    { day: 'Ter', contacts: 15, leads: 10, sales: 3 },
    { day: 'Qua', contacts: 18, leads: 12, sales: 4 },
    { day: 'Qui', contacts: 14, leads: 9, sales: 2 },
    { day: 'Sex', contacts: 20, leads: 14, sales: 5 },
    { day: 'Sáb', contacts: 8, leads: 5, sales: 1 },
    { day: 'Dom', contacts: 6, leads: 3, sales: 1 },
  ];

  const conversionFunnel = [
    { stage: 'Novo Lead', count: 45, percentage: 100 },
    { stage: 'Qualificação', count: 32, percentage: 71 },
    { stage: 'Proposta', count: 18, percentage: 40 },
    { stage: 'Concluída', count: 12, percentage: 27 },
  ];

  const recentLeads = [
    { name: 'João Silva', status: 'Novo', time: '5 min', value: 'R$ 5.000', priority: 'Alta' },
    { name: 'Maria Santos', status: 'Qualificação', time: '12 min', value: 'R$ 8.000', priority: 'Média' },
    { name: 'Pedro Almeida', status: 'Proposta', time: '25 min', value: 'R$ 12.000', priority: 'Alta' },
    { name: 'Ana Costa', status: 'Novo', time: '35 min', value: 'R$ 3.500', priority: 'Baixa' },
    { name: 'Carlos Oliveira', status: 'Qualificação', time: '1h', value: 'R$ 7.500', priority: 'Média' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Qualificação': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Proposta': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Concluída': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Meus Relatórios</h2>
        <p className="text-muted-foreground">Acompanhe sua performance individual e leads</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8 novos hoje
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.7%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1 text-blue-500" />
              12/45 convertidos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Este Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 89.5K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
              12 vendas fechadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 min</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
              Abaixo da meta
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts, Projects and Agenda Row */}
      <div className={`grid grid-cols-1 ${companyType === 'saas' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
        <Card>
          <CardHeader>
            <CardTitle>Performance Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="contacts" stroke="#3b82f6" strokeWidth={2} name="Contatos" />
                <Line type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Vendas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>
                  <Progress value={stage.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {companyType === 'saas' && (
          <ProjectWidget 
            onNavigate={onNavigate}
            onProjectSelect={(projectId) => {
              // This would need to be handled in the parent component
              console.log('Selected project:', projectId);
            }}
          />
        )}

        <AgendaWidget 
          onViewAll={() => {
            onNavigate?.('agenda');
          }}
          onAddEvent={() => {
            onNavigate?.('agenda');
          }}
        />
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Último contato: {lead.time} atrás
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <Badge className={getPriorityColor(lead.priority)} variant="outline">
                    {lead.priority}
                  </Badge>
                  <span className="text-sm font-medium ml-2">{lead.value}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}