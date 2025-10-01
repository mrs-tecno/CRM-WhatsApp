import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Edit, Trash2, Package, Users, MessageSquare, Zap, Layers, ShoppingCart, Calculator, Database } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  packageCount: number;
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
  clientCount: number;
}

export function PackageManagement() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      name: 'CRM WhatsApp',
      description: 'Módulo de gerenciamento de leads e vendas via WhatsApp',
      icon: 'MessageSquare',
      isActive: true,
      packageCount: 3
    },
    {
      id: '2',
      name: 'ERP',
      description: 'Sistema de gestão empresarial completo',
      icon: 'Database',
      isActive: true,
      packageCount: 3
    },
    {
      id: '3',
      name: 'PDV',
      description: 'Ponto de venda e controle de estoque',
      icon: 'ShoppingCart',
      isActive: false,
      packageCount: 0
    }
  ]);

  const [packages, setPackages] = useState<PackagePlan[]>([
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
      isActive: true,
      clientCount: 45
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
      isActive: true,
      clientCount: 78
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
        maxUsers: -1, // Ilimitado
        maxWhatsAppConnections: 10,
        maxN8nAutomations: -1, // Ilimitado
        supportLevel: 'Prioritário',
        customIntegrations: true,
        analytics: true,
        multiCompany: true
      },
      isActive: true,
      clientCount: 32
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
      isActive: true,
      clientCount: 23
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
      isActive: true,
      clientCount: 15
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
      isActive: true,
      clientCount: 8
    }
  ]);

  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  
  // Module states
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  // Package states
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackagePlan | null>(null);

  // Module handlers
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsModuleDialogOpen(true);
  };

  const handleAddNewModule = () => {
    setEditingModule({
      id: 'new',
      name: '',
      description: '',
      icon: 'Package',
      isActive: true,
      packageCount: 0
    });
    setIsModuleDialogOpen(true);
  };

  const handleSaveModule = () => {
    if (editingModule) {
      if (editingModule.id === 'new') {
        const newModule = {
          ...editingModule,
          id: Date.now().toString()
        };
        setModules([...modules, newModule]);
      } else {
        setModules(modules.map(m => m.id === editingModule.id ? editingModule : m));
      }
    }
    setIsModuleDialogOpen(false);
    setEditingModule(null);
  };

  const handleDeleteModule = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (module && module.packageCount > 0) {
      alert(`Não é possível excluir o módulo "${module.name}" pois existem ${module.packageCount} pacotes vinculados.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este módulo?')) {
      setModules(modules.filter(m => m.id !== id));
      setPackages(packages.filter(p => p.moduleId !== id));
    }
  };

  // Package handlers
  const handleEditPackage = (pkg: PackagePlan) => {
    setEditingPackage(pkg);
    setIsPackageDialogOpen(true);
  };

  const handleAddNewPackage = () => {
    if (!selectedModuleId || selectedModuleId === 'all') {
      alert('Selecione um módulo específico para criar o pacote');
      return;
    }
    
    setEditingPackage({
      id: 'new',
      moduleId: selectedModuleId,
      name: '',
      description: '',
      monthlyPrice: 0,
      quarterlyPrice: 0,
      annualPrice: 0,
      features: {
        maxUsers: 1,
        maxWhatsAppConnections: 1,
        maxN8nAutomations: 1,
        supportLevel: 'Email',
        customIntegrations: false,
        analytics: false,
        multiCompany: false
      },
      isActive: true,
      clientCount: 0
    });
    setIsPackageDialogOpen(true);
  };

  const handleSavePackage = () => {
    if (editingPackage) {
      if (editingPackage.id === 'new') {
        const newPackage = {
          ...editingPackage,
          id: Date.now().toString()
        };
        setPackages([...packages, newPackage]);
        
        // Update module package count
        setModules(modules.map(m => 
          m.id === editingPackage.moduleId 
            ? { ...m, packageCount: m.packageCount + 1 }
            : m
        ));
      } else {
        setPackages(packages.map(p => p.id === editingPackage.id ? editingPackage : p));
      }
    }
    setIsPackageDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg && pkg.clientCount > 0) {
      alert(`Não é possível excluir o pacote "${pkg.name}" pois existem ${pkg.clientCount} clientes utilizando-o.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este pacote?')) {
      const packageToDelete = packages.find(p => p.id === id);
      setPackages(packages.filter(p => p.id !== id));
      
      // Update module package count
      if (packageToDelete) {
        setModules(modules.map(m => 
          m.id === packageToDelete.moduleId 
            ? { ...m, packageCount: m.packageCount - 1 }
            : m
        ));
      }
    }
  };

  const formatValue = (value: number) => {
    return value === -1 ? 'Ilimitado' : value.toString();
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      MessageSquare,
      Database,
      ShoppingCart,
      Calculator,
      Package,
      Layers
    };
    const IconComponent = iconMap[iconName] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredPackages = selectedModuleId && selectedModuleId !== 'all'
    ? packages.filter(p => p.moduleId === selectedModuleId)
    : packages;

  const getModuleName = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.name : 'Módulo não encontrado';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Módulos e Pacotes</h2>
          <p className="text-muted-foreground">
            Configure os módulos e seus respectivos planos de assinatura
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Módulos
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pacotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Gerencie os módulos disponíveis na plataforma
            </p>
            <Button onClick={handleAddNewModule}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Módulo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className={`relative ${!module.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getIconComponent(module.icon)}
                        {module.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {module.description}
                      </p>
                    </div>
                    {!module.isActive && (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pacotes:</span>
                    <Badge variant="outline">{module.packageCount}</Badge>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditModule(module)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteModule(module.id)}
                      disabled={module.packageCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                Gerencie os pacotes de cada módulo
              </p>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os módulos</SelectItem>
                  {modules.filter(m => m.isActive).map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddNewPackage} disabled={!selectedModuleId || selectedModuleId === 'all'}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pacote
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${!pkg.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {pkg.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mb-1">
                        Módulo: {getModuleName(pkg.moduleId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.description}
                      </p>
                    </div>
                    {!pkg.isActive && (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mensal:</span>
                      <span className="font-medium">R$ {pkg.monthlyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trimestral:</span>
                      <span className="font-medium">R$ {pkg.quarterlyPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Anual:</span>
                      <span className="font-medium">R$ {pkg.annualPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Usuários</span>
                      </div>
                      <span className="text-sm font-medium">{formatValue(pkg.features.maxUsers)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">WhatsApp</span>
                      </div>
                      <span className="text-sm font-medium">{formatValue(pkg.features.maxWhatsAppConnections)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Automações</span>
                      </div>
                      <span className="text-sm font-medium">{formatValue(pkg.features.maxN8nAutomations)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Suporte</span>
                      <span className="text-sm font-medium">{pkg.features.supportLevel}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Integrações</span>
                      <Badge variant={pkg.features.customIntegrations ? "default" : "secondary"} className="text-xs">
                        {pkg.features.customIntegrations ? 'Sim' : 'Não'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics</span>
                      <Badge variant={pkg.features.analytics ? "default" : "secondary"} className="text-xs">
                        {pkg.features.analytics ? 'Sim' : 'Não'}
                      </Badge>
                    </div>
                  </div>

                  {/* Client Count */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Clientes ativos:</span>
                      <Badge variant="outline">{pkg.clientCount}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditPackage(pkg)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePackage(pkg.id)}
                      disabled={pkg.clientCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Edit Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingModule?.id === 'new' ? 'Novo Módulo' : 'Editar Módulo'}
            </DialogTitle>
            <DialogDescription>
              {editingModule?.id === 'new' 
                ? 'Crie um novo módulo do sistema' 
                : 'Edite o módulo selecionado'}
            </DialogDescription>
          </DialogHeader>
          
          {editingModule && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="moduleName">Nome do Módulo</Label>
                <Input
                  id="moduleName"
                  value={editingModule.name}
                  onChange={(e) => setEditingModule({...editingModule, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="moduleDescription">Descrição</Label>
                <Textarea
                  id="moduleDescription"
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="moduleIcon">Ícone</Label>
                <Select 
                  value={editingModule.icon} 
                  onValueChange={(value) => setEditingModule({...editingModule, icon: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MessageSquare">WhatsApp</SelectItem>
                    <SelectItem value="Database">ERP</SelectItem>
                    <SelectItem value="ShoppingCart">PDV</SelectItem>
                    <SelectItem value="Calculator">Financeiro</SelectItem>
                    <SelectItem value="Package">Geral</SelectItem>
                    <SelectItem value="Layers">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingModule.isActive}
                  onCheckedChange={(checked) => setEditingModule({...editingModule, isActive: checked})}
                />
                <Label>Módulo Ativo</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveModule}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Package Edit Dialog */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage?.id === 'new' ? 'Novo Pacote' : 'Editar Pacote'}
            </DialogTitle>
            <DialogDescription>
              {editingPackage?.id === 'new' 
                ? 'Crie um novo pacote de serviços' 
                : 'Edite o pacote de serviços selecionado'}
            </DialogDescription>
          </DialogHeader>
          
          {editingPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packageName">Nome do Pacote</Label>
                  <Input
                    id="packageName"
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="packageModule">Módulo</Label>
                  <Select 
                    value={editingPackage.moduleId} 
                    onValueChange={(value) => setEditingPackage({...editingPackage, moduleId: value})}
                    disabled={editingPackage.id !== 'new'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.filter(m => m.isActive).map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPackage.isActive}
                  onCheckedChange={(checked) => setEditingPackage({...editingPackage, isActive: checked})}
                />
                <Label>Pacote Ativo</Label>
              </div>
              
              <div>
                <Label htmlFor="packageDescription">Descrição</Label>
                <Textarea
                  id="packageDescription"
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({...editingPackage, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthly">Preço Mensal (R$)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    value={editingPackage.monthlyPrice}
                    onChange={(e) => setEditingPackage({...editingPackage, monthlyPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="quarterly">Preço Trimestral (R$)</Label>
                  <Input
                    id="quarterly"
                    type="number"
                    value={editingPackage.quarterlyPrice}
                    onChange={(e) => setEditingPackage({...editingPackage, quarterlyPrice: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="annual">Preço Anual (R$)</Label>
                  <Input
                    id="annual"
                    type="number"
                    value={editingPackage.annualPrice}
                    onChange={(e) => setEditingPackage({...editingPackage, annualPrice: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="users">Máx. Usuários (-1 = Ilimitado)</Label>
                  <Input
                    id="users"
                    type="number"
                    value={editingPackage.features.maxUsers}
                    onChange={(e) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, maxUsers: Number(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">Máx. WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="number"
                    value={editingPackage.features.maxWhatsAppConnections}
                    onChange={(e) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, maxWhatsAppConnections: Number(e.target.value)}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="automations">Máx. Automações (-1 = Ilimitado)</Label>
                  <Input
                    id="automations"
                    type="number"
                    value={editingPackage.features.maxN8nAutomations}
                    onChange={(e) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, maxN8nAutomations: Number(e.target.value)}
                    })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="support">Nível de Suporte</Label>
                <Input
                  id="support"
                  value={editingPackage.features.supportLevel}
                  onChange={(e) => setEditingPackage({
                    ...editingPackage,
                    features: {...editingPackage.features, supportLevel: e.target.value}
                  })}
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPackage.features.customIntegrations}
                    onCheckedChange={(checked) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, customIntegrations: checked}
                    })}
                  />
                  <Label>Integrações Customizadas</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPackage.features.analytics}
                    onCheckedChange={(checked) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, analytics: checked}
                    })}
                  />
                  <Label>Analytics Avançado</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingPackage.features.multiCompany}
                    onCheckedChange={(checked) => setEditingPackage({
                      ...editingPackage,
                      features: {...editingPackage.features, multiCompany: checked}
                    })}
                  />
                  <Label>Multi-empresa</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPackageDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePackage}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}