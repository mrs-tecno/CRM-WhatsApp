import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Building, Users } from 'lucide-react';
import type { UserRole } from '../App';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  onViewChange: (view: string) => void;
}

export function RoleSelector({ onRoleSelect, onViewChange }: RoleSelectorProps) {
  const handleRoleSelect = (role: UserRole) => {
    onRoleSelect(role);
    onViewChange('dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">WhatsApp CRM SaaS</h1>
          <p className="text-lg text-muted-foreground">
            Selecione o nível de acesso para visualizar o protótipo
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Admin SaaS</CardTitle>
              <CardDescription>
                Gestão de clientes e faturamento da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 mb-6">
                <li>• Dashboard de faturamento (MRR/ARR)</li>
                <li>• Gestão de empresas clientes</li>
                <li>• Configuração de pacotes</li>
                <li>• Controle de inadimplência</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('admin-saas')}
              >
                Acessar como Admin SaaS
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Admin Empresa</CardTitle>
              <CardDescription>
                Configuração e gerenciamento da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 mb-6">
                <li>• Relatórios de conversão</li>
                <li>• Gestão de usuários</li>
                <li>• Multi-conexão WhatsApp</li>
                <li>• Integração n8n</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('admin-empresa')}
              >
                Acessar como Admin Empresa
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Usuário</CardTitle>
              <CardDescription>
                CRM Kanban e atendimento ao cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 mb-6">
                <li>• Kanban de atendimentos</li>
                <li>• Gestão de leads</li>
                <li>• Histórico de conversas</li>
                <li>• Disparos de campanhas</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleRoleSelect('user')}
              >
                Acessar como Usuário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}