import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowRight, FolderKanban, Clock, Users, CheckCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'planejamento' | 'em_andamento' | 'finalizado' | 'pausado';
  tasksTotal: number;
  tasksCompleted: number;
  responsible: string[];
}

interface ProjectWidgetProps {
  onNavigate?: (view: string) => void;
  onProjectSelect?: (projectId: string) => void;
}

export function ProjectWidget({ onNavigate, onProjectSelect }: ProjectWidgetProps) {
  // Mock projects data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Sistema ERP MRS',
      progress: 63,
      status: 'em_andamento',
      tasksTotal: 47,
      tasksCompleted: 17,
      responsible: ['Ana Costa', 'Carlos Oliveira', 'Laura Ferreira']
    },
    {
      id: '2',
      name: 'PDV Maui',
      progress: 56,
      status: 'em_andamento',
      tasksTotal: 36,
      tasksCompleted: 9,
      responsible: ['Carlos Oliveira', 'Maria Santos', 'Pedro Silva']
    },
    {
      id: '3',
      name: 'Aplicativo Mobile',
      progress: 17,
      status: 'planejamento',
      tasksTotal: 28,
      tasksCompleted: 4,
      responsible: ['Maria Santos', 'Laura Ferreira']
    }
  ];

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

  const activeProjects = projects.filter(p => p.status === 'em_andamento');
  const totalTasks = projects.reduce((sum, p) => sum + p.tasksTotal, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.tasksCompleted, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            <CardTitle>Projetos</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate?.('projects')}
          >
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <FolderKanban className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Projetos</span>
            </div>
            <p className="text-lg font-bold">{projects.length}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ativos</span>
            </div>
            <p className="text-lg font-bold">{activeProjects.length}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Tarefas</span>
            </div>
            <p className="text-lg font-bold">{completedTasks}/{totalTasks}</p>
          </div>
        </div>

        {/* Active Projects */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Projetos em Andamento</h4>
          {activeProjects.slice(0, 3).map((project) => (
            <div 
              key={project.id} 
              className="p-3 bg-card border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => onProjectSelect?.(project.id)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{project.name}</p>
                    <Badge className={`${getStatusColor(project.status)} text-xs mt-1`}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Progresso</span>
                    <span className="text-xs font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{project.responsible.length} responsáveis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{project.tasksCompleted}/{project.tasksTotal} tarefas</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onNavigate?.('projects')}
        >
          <FolderKanban className="h-4 w-4 mr-2" />
          Gerenciar Projetos
        </Button>
      </CardContent>
    </Card>
  );
}