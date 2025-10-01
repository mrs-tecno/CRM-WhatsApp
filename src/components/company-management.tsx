import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Plus, Search, Edit, Trash2, Building2, AlertTriangle, CheckCircle, MessageSquare, Database, ShoppingCart, Package, X } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

interface PackagePlan {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  annualPrice: number;
  features: {
    maxUsers: number;
    maxWhatsAppConnections: number;
    maxN8nAutomations: number;
    supportLevel: string;
    customIntegrations: boolean;
    analytics: boolean;
    multiCompany: boolean;
  };
  isActive: boolean;
}

interface CompanyModule {
  moduleId: string;
  packageId: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
}

interface Company {
  id: string;
  name: string;
  companyType: 'saas' | 'vendas';
  status: 'active' | 'suspended' | 'trial' | 'overdue';
  modules: CompanyModule[];
  totalUsers: number;
  totalMrr: number;
  lastPayment: string;
  nextPayment: string;
}

export function CompanyManagement() {
  // Mock data for modules and packages (same as package-management)
  const [modules] = useState<Module[]>([
    {
      id: '1',
      name: 'CRM WhatsApp',
      description: 'Módulo de gerenciamento de leads e vendas via WhatsApp',
      icon: 'MessageSquare',
      isActive: true
    },
    {
      id: '2',
      name: 'ERP',
      description: 'Sistema de gestão empresarial completo',
      icon: 'Database',
      isActive: true
    },
    {
      id: '3',
      name: 'PDV',
      description: 'Ponto de venda e controle de estoque',
      icon: 'ShoppingCart',
      isActive: false
    }
  ]);

  const [packages] = useState<PackagePlan[]>([
    // CRM WhatsApp packages
    {
      id: '1',
      moduleId: '1',
      name: 'Básico',
      description: 'Ideal para pequenas empresas começando com WhatsApp',
      monthlyPrice: 297,
      quarterlyPrice: 267,
      annualPrice: 237,
      features: {
        maxUsers: 3,
        maxWhatsAppConnections: 1,
        maxN8nAutomations: 5,
        supportLevel: 'Email',
        customIntegrations: false,
        analytics: false,
        multiCompany: false
      },
      isActive: true
    },
    {
      id: '2',
      moduleId: '1',
      name: 'Pro',
      description: 'Para empresas em crescimento que precisam de mais recursos',
      monthlyPrice: 597,
      quarterlyPrice: 537,
      annualPrice: 477,
      features: {
        maxUsers: 10,
        maxWhatsAppConnections: 3,
        maxN8nAutomations: 20,
        supportLevel: 'Chat + Email',
        customIntegrations: true,
        analytics: true,
        multiCompany: false
      },
      isActive: true
    },
    {
      id: '3',
      moduleId: '1',
      name: 'Enterprise',
      description: 'Solução completa para grandes empresas',
      monthlyPrice: 1497,
      quarterlyPrice: 1347,
      annualPrice: 1197,
      features: {
        maxUsers: -1,
        maxWhatsAppConnections: 10,
        maxN8nAutomations: -1,
        supportLevel: 'Prioritário',
        customIntegrations: true,
        analytics: true,
        multiCompany: true
      },
      isActive: true
    },
    // ERP packages
    {
      id: '4',
      moduleId: '2',
      name: 'Básico',
      description: 'Gestão básica de vendas e estoque',
      monthlyPrice: 197,
      quarterlyPrice: 177,
      annualPrice: 157,
      features: {
        maxUsers: 2,
        maxWhatsAppConnections: 0,
        maxN8nAutomations: 0,
        supportLevel: 'Email',
        customIntegrations: false,
        analytics: false,
        multiCompany: false
      },
      isActive: true
    },
    {
      id: '5',
      moduleId: '2',
      name: 'Pro',
      description: 'Gestão completa com relatórios avançados',
      monthlyPrice: 397,
      quarterlyPrice: 357,
      annualPrice: 317,
      features: {
        maxUsers: 8,
        maxWhatsAppConnections: 0,
        maxN8nAutomations: 10,
        supportLevel: 'Chat + Email',
        customIntegrations: true,
        analytics: true,
        multiCompany: false
      },
      isActive: true
    },
    {
      id: '6',
      moduleId: '2',
      name: 'Enterprise',
      description: 'Solução empresarial com multi-filiais',
      monthlyPrice: 897,
      quarterlyPrice: 807,
      annualPrice: 717,
      features: {
        maxUsers: -1,
        maxWhatsAppConnections: 0,
        maxN8nAutomations: -1,
        supportLevel: 'Prioritário',
        customIntegrations: true,
        analytics: true,
        multiCompany: true
      },
      isActive: true
    }
  ]);

  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'TechCorp Ltd',
      companyType: 'saas',
      status: 'active',
      modules: [
        { moduleId: '1', packageId: '3', billingCycle: 'monthly' },
        { moduleId: '2', packageId: '6', billingCycle: 'annual' }
      ],
      totalUsers: 25,
      totalMrr: 2194,
      lastPayment: '2024-01-01',
      nextPayment: '2024-02-01'
    },
    {
      id: '2',
      name: 'Digital Solutions',
      companyType: 'vendas',
      status: 'active',
      modules: [
        { moduleId: '1', packageId: '2', billingCycle: 'quarterly' }
      ],
      totalUsers: 10,
      totalMrr: 537,
      lastPayment: '2024-01-15',
      nextPayment: '2024-02-15'
    },
    {
      id: '3',
      name: 'StartupX',
      companyType: 'vendas',
      status: 'trial',
      modules: [
        { moduleId: '1', packageId: '1', billingCycle: 'monthly' }
      ],
      totalUsers: 3,
      totalMrr: 0,
      lastPayment: 'N/A',
      nextPayment: '2024-01-30'
    },
    {
      id: '4',
      name: 'E-commerce Plus',
      companyType: 'saas',
      status: 'overdue',
      modules: [
        { moduleId: '1', packageId: '1', billingCycle: 'monthly' },
        { moduleId: '2', packageId: '4', billingCycle: 'monthly' }
      ],
      totalUsers: 5,
      totalMrr: 494,
      lastPayment: '2023-12-01',
      nextPayment: '2024-01-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const statuses = ['active', 'suspended', 'trial', 'overdue'];
  const companyTypes = ['saas', 'vendas'];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'trial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'overdue': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'suspended': return 'Suspenso';
      case 'trial': return 'Trial';
      case 'overdue': return 'Inadimplente';
      default: return status;
    }
  };

  const getCompanyTypeText = (type: string) => {
    switch (type) {
      case 'saas': return 'Empresa SAAS';
      case 'vendas': return 'Empresa Vendas';
      default: return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'suspended': return <Trash2 className="h-4 w-4" />;
      case 'trial': return <Building2 className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingCompany) {
      if (editingCompany.id === 'new') {
        // Add new company
        const newCompany = {
          ...editingCompany,
          id: Date.now().toString()
        };
        setCompanies([...companies, newCompany]);
      } else {
        // Update existing company
        setCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
      }
    }
    setIsDialogOpen(false);
    setEditingCompany(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      MessageSquare,
      Database,
      ShoppingCart,
      Package
    };
    const IconComponent = iconMap[iconName] || Package;
    return <IconComponent className="h-4 w-4" />;
  };

  const getModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.name : 'Módulo não encontrado';
  };

  const getPackageName = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? pkg.name : 'Pacote não encontrado';
  };

  const getPackagePrice = (packageId: string, billingCycle: 'monthly' | 'quarterly' | 'annual') => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return 0;
    
    switch (billingCycle) {
      case 'monthly': return pkg.monthlyPrice;
      case 'quarterly': return pkg.quarterlyPrice;
      case 'annual': return pkg.annualPrice;
      default: return pkg.monthlyPrice;
    }
  };

  const calculateTotalMrr = (companyModules: CompanyModule[]) => {
    return companyModules.reduce((total, module) => {
      const price = getPackagePrice(module.packageId, module.billingCycle);
      // Convert to monthly for MRR calculation
      let monthlyPrice = price;
      if (module.billingCycle === 'quarterly') monthlyPrice = price / 3;
      if (module.billingCycle === 'annual') monthlyPrice = price / 12;
      return total + monthlyPrice;
    }, 0);
  };

  const calculateTotalUsers = (companyModules: CompanyModule[]) => {
    return companyModules.reduce((total, module) => {
      const pkg = packages.find(p => p.id === module.packageId);
      if (!pkg) return total;
      return total + (pkg.features.maxUsers === -1 ? 1000 : pkg.features.maxUsers); // Treat unlimited as 1000 for calculation
    }, 0);
  };

  const handleAddNew = () => {
    setEditingCompany({
      id: 'new',
      name: '',
      companyType: 'vendas',
      status: 'active',
      modules: [],
      totalUsers: 0,
      totalMrr: 0,
      lastPayment: '',
      nextPayment: ''
    });
    setIsDialogOpen(true);
  };

  const handleModuleChange = (moduleId: string, checked: boolean) => {
    if (!editingCompany) return;

    if (checked) {
      // Add module with default package (first available)
      const availablePackages = packages.filter(p => p.moduleId === moduleId && p.isActive);
      if (availablePackages.length > 0) {
        const newModule: CompanyModule = {
          moduleId,
          packageId: availablePackages[0].id,
          billingCycle: 'monthly'
        };
        const updatedModules = [...editingCompany.modules, newModule];
        setEditingCompany({
          ...editingCompany,
          modules: updatedModules,
          totalUsers: calculateTotalUsers(updatedModules),
          totalMrr: calculateTotalMrr(updatedModules)
        });
      }
    } else {
      // Remove module
      const updatedModules = editingCompany.modules.filter(m => m.moduleId !== moduleId);
      setEditingCompany({
        ...editingCompany,
        modules: updatedModules,
        totalUsers: calculateTotalUsers(updatedModules),
        totalMrr: calculateTotalMrr(updatedModules)
      });
    }
  };

  const handleModulePackageChange = (moduleId: string, packageId: string) => {
    if (!editingCompany) return;

    const updatedModules = editingCompany.modules.map(m => 
      m.moduleId === moduleId ? { ...m, packageId } : m
    );
    setEditingCompany({
      ...editingCompany,
      modules: updatedModules,
      totalUsers: calculateTotalUsers(updatedModules),
      totalMrr: calculateTotalMrr(updatedModules)
    });
  };

  const handleModuleBillingChange = (moduleId: string, billingCycle: 'monthly' | 'quarterly' | 'annual') => {
    if (!editingCompany) return;

    const updatedModules = editingCompany.modules.map(m => 
      m.moduleId === moduleId ? { ...m, billingCycle } : m
    );
    setEditingCompany({
      ...editingCompany,
      modules: updatedModules,
      totalUsers: calculateTotalUsers(updatedModules),
      totalMrr: calculateTotalMrr(updatedModules)
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Empresas</h2>
          <p className="text-muted-foreground">
            Gerencie todas as empresas clientes da plataforma
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{companies.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Em Trial</p>
                <p className="text-2xl font-bold">{companies.filter(c => c.status === 'trial').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Inadimplentes</p>
                <p className="text-2xl font-bold">{companies.filter(c => c.status === 'overdue').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Suspensas</p>
                <p className="text-2xl font-bold">{companies.filter(c => c.status === 'suspended').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead>Próximo Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <Badge variant={company.companyType === 'saas' ? 'default' : 'secondary'}>
                      {getCompanyTypeText(company.companyType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {company.modules.map((module) => {
                        const moduleInfo = modules.find(m => m.id === module.moduleId);
                        const packageInfo = packages.find(p => p.id === module.packageId);
                        return (
                          <Badge key={module.moduleId} variant="outline" className="text-xs">
                            {moduleInfo?.name} - {packageInfo?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(company.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(company.status)}
                        {getStatusText(company.status)}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>{company.totalUsers}</TableCell>
                  <TableCell>R$ {Math.round(company.totalMrr).toLocaleString()}</TableCell>
                  <TableCell>
                    {company.lastPayment !== 'N/A' 
                      ? new Date(company.lastPayment).toLocaleDateString()
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(company.nextPayment).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(company)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCompany?.id === 'new' ? 'Nova Empresa' : 'Editar Empresa'}
            </DialogTitle>
            <DialogDescription>
              {editingCompany?.id === 'new' 
                ? 'Adicione uma nova empresa ao sistema e configure seus módulos' 
                : 'Edite as informações da empresa e seus módulos'}
            </DialogDescription>
          </DialogHeader>
          
          {editingCompany && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyType">Tipo de Empresa</Label>
                  <Select 
                    value={editingCompany.companyType} 
                    onValueChange={(value: any) => setEditingCompany({...editingCompany, companyType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {getCompanyTypeText(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingCompany.status} 
                    onValueChange={(value: any) => setEditingCompany({...editingCompany, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {getStatusText(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Modules Selection */}
              <div>
                <h3 className="text-lg font-medium mb-4">Módulos e Planos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione os módulos que a empresa terá acesso e configure o plano de cada um.
                </p>

                <div className="space-y-4">
                  {modules.filter(m => m.isActive).map((module) => {
                    const isSelected = editingCompany.modules.some(m => m.moduleId === module.id);
                    const companyModule = editingCompany.modules.find(m => m.moduleId === module.id);
                    const availablePackages = packages.filter(p => p.moduleId === module.id && p.isActive);

                    return (
                      <Card key={module.id} className={`${isSelected ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleModuleChange(module.id, checked as boolean)}
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getIconComponent(module.icon)}
                                <h4 className="font-medium">{module.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{module.description}</p>

                              {isSelected && companyModule && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm">Plano</Label>
                                    <Select
                                      value={companyModule.packageId}
                                      onValueChange={(value) => handleModulePackageChange(module.id, value)}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availablePackages.map((pkg) => (
                                          <SelectItem key={pkg.id} value={pkg.id}>
                                            <div className="flex flex-col">
                                              <span>{pkg.name}</span>
                                              <span className="text-xs text-muted-foreground">
                                                R$ {pkg.monthlyPrice}/mês • {pkg.features.maxUsers === -1 ? 'Usuários ilimitados' : `${pkg.features.maxUsers} usuários`}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-sm">Ciclo de Cobrança</Label>
                                    <Select
                                      value={companyModule.billingCycle}
                                      onValueChange={(value: any) => handleModuleBillingChange(module.id, value)}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="monthly">
                                          Mensal - R$ {getPackagePrice(companyModule.packageId, 'monthly')}/mês
                                        </SelectItem>
                                        <SelectItem value="quarterly">
                                          Trimestral - R$ {getPackagePrice(companyModule.packageId, 'quarterly')}/trimestre
                                        </SelectItem>
                                        <SelectItem value="annual">
                                          Anual - R$ {getPackagePrice(companyModule.packageId, 'annual')}/ano
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Resumo da Configuração</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total de usuários:</span>
                    <span className="ml-2 font-medium">
                      {editingCompany.totalUsers === 1000 ? 'Ilimitado' : editingCompany.totalUsers}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">MRR Total:</span>
                    <span className="ml-2 font-medium">R$ {Math.round(editingCompany.totalMrr).toLocaleString()}</span>
                  </div>
                </div>
                
                {editingCompany.modules.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Módulos selecionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {editingCompany.modules.map((module) => (
                        <Badge key={module.moduleId} variant="secondary" className="text-xs">
                          {getModuleName(module.moduleId)} - {getPackageName(module.packageId)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!editingCompany?.modules.length}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}