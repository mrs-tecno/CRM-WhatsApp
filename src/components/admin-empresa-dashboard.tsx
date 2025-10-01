import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Users, Target, DollarSign, Phone } from 'lucide-react';
import { AgendaWidget } from './agenda-widget';
import { ProjectWidget } from './project-widget';

interface AdminEmpresaDashboardProps {
  onNavigate?: (view: string) => void;
  companyType?: 'saas' | 'vendas';
}

export function AdminEmpresaDashboard({ onNavigate, companyType = 'vendas' }: AdminEmpresaDashboardProps = {}) {
  const conversionData = [
    { name: 'Ana Costa', leads: 45, converted: 12, rate: 26.7 },
    { name: 'Carlos Oliveira', leads: 38, converted: 15, rate: 39.5 },
    { name: 'Pedro Silva', leads: 29, converted: 7, rate: 24.1 },
    { name: 'Maria Santos', leads: 33, converted: 10, rate: 30.3 },
  ];

  const leadsOverTime = [
    { month: 'Jan', leads: 142, sales: 38 },
    { month: 'Fev', leads: 158, sales: 42 },
    { month: 'Mar', leads: 134, sales: 35 },
    { month: 'Abr', leads: 167, sales: 48 },
    { month: 'Mai', leads: 145, sales: 44 },
    { month: 'Jun', leads: 189, sales: 52 },
  ];

  const leadSources = [
    { name: 'WhatsApp Orgânico', value: 45, color: '#25d366' },
    { name: 'Anúncios Facebook', value: 30, color: '#1877f2' },
    { name: 'Google Ads', value: 15, color: '#4285f4' },
    { name: 'Indicações', value: 10, color: '#ff9800' },
  ];

  const teamPerformance = [
    { name: 'Ana Costa', avatar: 'AC', leads: 45, sales: 12, value: 89500, whatsapp: '+55 11 99999-0001' },
    { name: 'Carlos Oliveira', avatar: 'CO', leads: 38, sales: 15, value: 112800, whatsapp: '+55 11 99999-0002' },
    { name: 'Pedro Silva', avatar: 'PS', leads: 29, sales: 7, value: 52300, whatsapp: 'Não conectado' },
    { name: 'Maria Santos', avatar: 'MS', leads: 33, sales: 10, value: 76200, whatsapp: '+55 11 99999-0003' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Admin Empresa</h2>
        <p className="text-muted-foreground">Relatórios consolidados e performance da equipe</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +4.1% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads este Mês</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +30% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 330.8K</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
              52 vendas fechadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1 text-blue-500" />
              1 conexão pendente
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Atendente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'rate' ? `${value}%` : value,
                  name === 'rate' ? 'Taxa Conversão' : name === 'leads' ? 'Leads' : 'Convertidos'
                ]} />
                <Bar dataKey="leads" fill="#3b82f6" name="leads" />
                <Bar dataKey="converted" fill="#10b981" name="converted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origem dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSources}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance, Trends, Projects and Agenda */}
      <div className={`grid grid-cols-1 ${companyType === 'saas' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Leads e Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} name="Leads" />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} name="Vendas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.whatsapp !== 'Não conectado' ? member.whatsapp : 'WhatsApp não conectado'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 mb-1">
                      <Badge variant="outline">{member.leads} leads</Badge>
                      <Badge variant="secondary">{member.sales} vendas</Badge>
                    </div>
                    <p className="text-sm font-medium">R$ {member.value.toLocaleString()}</p>
                  </div>
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
    </div>
  );
}