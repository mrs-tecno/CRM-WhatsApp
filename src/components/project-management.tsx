import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Plus, Search, Eye, Users, Clock, CheckCircle, Calendar, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planejamento' | 'em_andamento' | 'finalizado' | 'pausado';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  administrator: string;
  responsible: string[];
  startDate: string;
  endDate: string;
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
  createdAt: string;
}

interface ResponsibleStats {
  id: string;
  name: string;
  initials: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  accumulatedTasks: number;
  overallProgress: number;
  projects: {
    name: string;
    tasksCount: string;
  }[];
}

interface ProjectManagementProps {
  onProjectSelect?: (projectId: string) => void;
}

export function ProjectManagement({ onProjectSelect }: ProjectManagementProps) {
  // Mock users data
  const [users] = useState<User[]>([
    { id: '1', name: 'Ana Costa', email: 'ana@empresa.com', role: 'Gerente' },
    { id: '2', name: 'Carlos Oliveira', email: 'carlos@empresa.com', role: 'Desenvolvedor' },
    { id: '3', name: 'Maria Santos', email: 'maria@empresa.com', role: 'Designer' },
    { id: '4', name: 'Pedro Silva', email: 'pedro@empresa.com', role: 'QA' },
    { id: '5', name: 'Laura Ferreira', email: 'laura@empresa.com', role: 'Analista' },
  ]);

  // Mock responsibles stats data
  const [responsibles] = useState<ResponsibleStats[]>([
    {
      id: '1',
      name: 'Moisés Souza',
      initials: 'EM',
      totalTasks: 47,
      completedTasks: 1,
      inProgressTasks: 0,
      todoTasks: 1,
      accumulatedTasks: 1,
      overallProgress: 33,
      projects: [
        { name: 'ANOTAÇÃO - VK', tasksCount: '1tarefa' },
        { name: 'API PAGAMENTO - INTERFACE', tasksCount: '1tarefa' },
        { name: 'ERP_VB', tasksCount: '1tarefa' }
      ]
    },
    {
      id: '2',
      name: 'Carlos',
      initials: 'C',
      totalTasks: 89,
      completedTasks: 56,
      inProgressTasks: 3,
      todoTasks: 24,
      accumulatedTasks: 0,
      overallProgress: 67,
      projects: [
        { name: 'PDV MAUI', tasksCount: '55tarefas' },
        { name: 'ERP_VB', tasksCount: '11tarefas' },
        { name: 'ANOTAÇÃO - VK', tasksCount: '8tarefas' },
        { name: 'gerenciador de projetos e tarefas', tasksCount: '3tarefas' }
      ]
    },
    {
      id: '3',
      name: 'Lucas',
      initials: 'GU',
      totalTasks: 1,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 1,
      accumulatedTasks: 0,
      overallProgress: 0,
      projects: [
        { name: 'ANOTE FACIL', tasksCount: '1tarefa' }
      ]
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sistema ERP MRS',
      description: 'Desenvolvimento de sistema ERP completo para gestão empresarial',
      status: 'em_andamento',
      priority: 'alta',
      administrator: '1',
      responsible: ['1', '2', '5'],
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      progress: 63,
      tasksTotal: 47,
      tasksCompleted: 17,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'PDV Maui',
      description: 'Sistema de ponto de venda com interface moderna e intuitiva',
      status: 'em_andamento',
      priority: 'alta',
      administrator: '1',
      responsible: ['2', '3', '4'],
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      progress: 56,
      tasksTotal: 36,
      tasksCompleted: 9,
      createdAt: '2024-01-25'
    },
    {
      id: '3',
      name: 'Aplicativo Mobile',
      description: 'App mobile para acompanhamento de vendas e métricas',
      status: 'planejamento',
      priority: 'media',
      administrator: '1',
      responsible: ['3', '5'],
      startDate: '2024-03-01',
      endDate: '2024-08-01',
      progress: 17,
      tasksTotal: 28,
      tasksCompleted: 4,
      createdAt: '2024-02-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('projects');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'finalizado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'planejamento': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pausado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_andamento': return 'Em Andamento';
      case 'finalizado': return 'Finalizado';
      case 'planejamento': return 'Planejamento';
      case 'pausado': return 'Pausado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return priority;
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Usuário não encontrado';
  };

  const handleAddNew = () => {
    setEditingProject({
      id: 'new',
      name: '',
      description: '',
      status: 'planejamento',
      priority: 'media',
      administrator: '',
      responsible: [],
      startDate: '',
      endDate: '',
      progress: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingProject) {
      if (editingProject.id === 'new') {
        const newProject = {
          ...editingProject,
          id: Date.now().toString()
        };
        setProjects([...projects, newProject]);
      } else {
        setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      }
    }
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  const handleResponsibleChange = (userId: string, checked: boolean) => {
    if (!editingProject) return;
    
    if (checked) {
      setEditingProject({
        ...editingProject,
        responsible: [...editingProject.responsible, userId]
      });
    } else {
      setEditingProject({
        ...editingProject,
        responsible: editingProject.responsible.filter(id => id !== userId)
      });
    }
  };

  const getProjectStats = () => {
    return {
      total: projects.length,
      emAndamento: projects.filter(p => p.status === 'em_andamento').length,
      finalizado: projects.filter(p => p.status === 'finalizado').length,
      planejamento: projects.filter(p => p.status === 'planejamento').length,
    };
  };

  const stats = getProjectStats();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Projetos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os projetos da empresa
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="responsibles">Responsáveis</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6 mt-6">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{stats.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finalizados</p>
                <p className="text-2xl font-bold">{stats.finalizado}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Planejamento</p>
                <p className="text-2xl font-bold">{stats.planejamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Filters */}
          <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="planejamento">Planejamento</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
            <SelectItem value="pausado">Pausado</SelectItem>
          </SelectContent>
        </Select>
      </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} title={getPriorityText(project.priority)} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progresso</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Admin: {getUserName(project.administrator)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Responsáveis: {project.responsible.length}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{project.tasksCompleted} de {project.tasksTotal} tarefas</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onProjectSelect?.(project.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Tarefas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </TabsContent>

        <TabsContent value="responsibles" className="space-y-6 mt-6">
          {/* Responsibles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responsibles.map((responsible) => (
              <div key={responsible.id} className="bg-card border rounded-lg p-6 space-y-4">
                {/* Header with initials and name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center font-medium">
                    {responsible.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold">{responsible.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Progresso</span>
                      <span className="font-medium">{responsible.overallProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${responsible.overallProgress}%` }}
                  />
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{responsible.completedTasks}</span>
                      <span className="text-sm text-green-600">Concluídas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">{responsible.inProgressTasks}</span>
                      <span className="text-sm text-orange-600">Em Progresso</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{responsible.todoTasks}</span>
                      <span className="text-sm text-blue-600">A Fazer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-600">{responsible.accumulatedTasks}</span>
                      <span className="text-sm text-gray-600">Acumulação de tarefas</span>
                    </div>
                  </div>
                </div>

                {/* Projects List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Projetos</h4>
                  <div className="space-y-1">
                    {responsible.projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-muted-foreground">{project.tasksCount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.id === 'new' ? 'Novo Projeto' : 'Editar Projeto'}
            </DialogTitle>
            <DialogDescription>
              {editingProject?.id === 'new' 
                ? 'Crie um novo projeto e defina os responsáveis' 
                : 'Edite as informações do projeto'}
            </DialogDescription>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Projeto</Label>
                  <Input
                    id="name"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingProject.status} 
                    onValueChange={(value: any) => setEditingProject({...editingProject, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={editingProject.priority} 
                    onValueChange={(value: any) => setEditingProject({...editingProject, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="administrator">Administrador</Label>
                  <Select 
                    value={editingProject.administrator} 
                    onValueChange={(value) => setEditingProject({...editingProject, administrator: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o administrador" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Responsáveis</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {users.map(user => (
                    <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.responsible.includes(user.id)}
                        onChange={(e) => handleResponsibleChange(user.id, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">{user.name} - {user.role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}