import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  ArrowLeft, 
  Calendar, 
  User, 
  Flag, 
  Clock,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  assignedTo: string;
  estimatedHours: number;
  spentHours: number;
  dueDate: string;
  createdAt: string;
  comments: number;
  attachments: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectKanbanProps {
  project: Project;
  onBack: () => void;
}

export function ProjectKanban({ project, onBack }: ProjectKanbanProps) {
  // Mock users data
  const [users] = useState<User[]>([
    { id: '1', name: 'Ana Costa', email: 'ana@empresa.com', role: 'Gerente' },
    { id: '2', name: 'Carlos Oliveira', email: 'carlos@empresa.com', role: 'Desenvolvedor' },
    { id: '3', name: 'Maria Santos', email: 'maria@empresa.com', role: 'Designer' },
    { id: '4', name: 'Pedro Silva', email: 'pedro@empresa.com', role: 'QA' },
    { id: '5', name: 'Laura Ferreira', email: 'laura@empresa.com', role: 'Analista' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Análise de Requisitos',
      description: 'Levantar todos os requisitos funcionais e não funcionais do sistema',
      status: 'done',
      priority: 'alta',
      assignedTo: '1',
      estimatedHours: 20,
      spentHours: 18,
      dueDate: '2024-01-20',
      createdAt: '2024-01-10',
      comments: 3,
      attachments: 2
    },
    {
      id: '2',
      title: 'Design da Interface',
      description: 'Criar mockups e protótipos das principais telas do sistema',
      status: 'in_progress',
      priority: 'alta',
      assignedTo: '3',
      estimatedHours: 30,
      spentHours: 15,
      dueDate: '2024-02-15',
      createdAt: '2024-01-15',
      comments: 1,
      attachments: 5
    },
    {
      id: '3',
      title: 'Desenvolvimento Backend',
      description: 'Implementar APIs e lógica de negócio do sistema',
      status: 'todo',
      priority: 'alta',
      assignedTo: '2',
      estimatedHours: 80,
      spentHours: 0,
      dueDate: '2024-03-30',
      createdAt: '2024-01-20',
      comments: 0,
      attachments: 0
    },
    {
      id: '4',
      title: 'Testes Unitários',
      description: 'Criar e executar testes unitários para garantir qualidade',
      status: 'backlog',
      priority: 'media',
      assignedTo: '4',
      estimatedHours: 40,
      spentHours: 0,
      dueDate: '2024-04-15',
      createdAt: '2024-01-25',
      comments: 0,
      attachments: 0
    },
    {
      id: '5',
      title: 'Integração Frontend',
      description: 'Conectar interface com as APIs desenvolvidas',
      status: 'backlog',
      priority: 'alta',
      assignedTo: '2',
      estimatedHours: 50,
      spentHours: 0,
      dueDate: '2024-04-30',
      createdAt: '2024-01-25',
      comments: 0,
      attachments: 0
    },
    {
      id: '6',
      title: 'Documentação Técnica',
      description: 'Elaborar documentação completa do sistema',
      status: 'todo',
      priority: 'media',
      assignedTo: '5',
      estimatedHours: 25,
      spentHours: 5,
      dueDate: '2024-05-15',
      createdAt: '2024-02-01',
      comments: 2,
      attachments: 1
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'todo', title: 'A Fazer', color: 'bg-blue-100 dark:bg-blue-900' },
    { id: 'in_progress', title: 'Em Andamento', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { id: 'done', title: 'Finalizado', color: 'bg-green-100 dark:bg-green-900' }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => {
      const matchesStatus = task.status === status;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesStatus && matchesSearch && matchesPriority;
    });
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
    return user ? user.name : 'Não atribuído';
  };

  const getUserInitials = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NA';
  };

  const handleAddTask = (status: string) => {
    setEditingTask({
      id: 'new',
      title: '',
      description: '',
      status: status as any,
      priority: 'media',
      assignedTo: '',
      estimatedHours: 0,
      spentHours: 0,
      dueDate: '',
      createdAt: new Date().toISOString().split('T')[0],
      comments: 0,
      attachments: 0
    });
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      if (editingTask.id === 'new') {
        const newTask = {
          ...editingTask,
          id: Date.now().toString()
        };
        setTasks([...tasks, newTask]);
      } else {
        setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      }
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Prioridades</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="space-y-4">
              <div className={`p-4 rounded-lg ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{column.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{columnTasks.length}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddTask(column.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {columnTasks.map(task => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Task Header */}
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTask(task)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTask(task.id)}
                              className="h-6 w-6 p-0 text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Task Description */}
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Priority and Due Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <span className="text-xs text-muted-foreground">
                              {getPriorityText(task.priority)}
                            </span>
                          </div>
                          {task.dueDate && (
                            <div className={`flex items-center gap-1 text-xs ${
                              isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Time Tracking */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.spentHours}h / {task.estimatedHours}h
                          </div>
                        </div>

                        {/* Task Footer */}
                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(task.assignedTo)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex items-center gap-2">
                            {task.comments > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {task.comments}
                              </div>
                            )}
                            {task.attachments > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Paperclip className="h-3 w-3" />
                                {task.attachments}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Move Task Buttons */}
                        {column.id !== 'backlog' && (
                          <div className="flex gap-1">
                            {column.id !== 'todo' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === column.id) - 1].id)}
                                className="text-xs h-6"
                              >
                                ← Anterior
                              </Button>
                            )}
                            {column.id !== 'done' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === column.id) + 1].id)}
                                className="text-xs h-6"
                              >
                                Próximo →
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTask?.id === 'new' ? 'Nova Tarefa' : 'Editar Tarefa'}
            </DialogTitle>
            <DialogDescription>
              {editingTask?.id === 'new' 
                ? 'Crie uma nova tarefa para o projeto' 
                : 'Edite as informações da tarefa'}
            </DialogDescription>
          </DialogHeader>
          
          {editingTask && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Tarefa</Label>
                <Input
                  id="title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(value: any) => setEditingTask({...editingTask, priority: value})}
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
                  <Label htmlFor="assignedTo">Responsável</Label>
                  <Select 
                    value={editingTask.assignedTo} 
                    onValueChange={(value) => setEditingTask({...editingTask, assignedTo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={editingTask.estimatedHours}
                    onChange={(e) => setEditingTask({...editingTask, estimatedHours: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="spentHours">Horas Gastas</Label>
                  <Input
                    id="spentHours"
                    type="number"
                    value={editingTask.spentHours}
                    onChange={(e) => setEditingTask({...editingTask, spentHours: Number(e.target.value)})}
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Data de Entrega</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTask}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}