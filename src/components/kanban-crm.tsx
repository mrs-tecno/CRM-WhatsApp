import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Plus, Eye } from 'lucide-react';
import type { Lead } from '../App';

interface KanbanCRMProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onSelectLead: (lead: Lead) => void;
}

export function KanbanCRM({ leads, onUpdateLead, onSelectLead }: KanbanCRMProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResponsible, setFilterResponsible] = useState('all');

  const columns = [
    { id: 'novo', title: 'Novo Lead', color: 'bg-blue-500' },
    { id: 'qualificacao', title: 'Qualificação', color: 'bg-yellow-500' },
    { id: 'proposta', title: 'Proposta Enviada', color: 'bg-orange-500' },
    { id: 'concluida', title: 'Venda Concluída', color: 'bg-green-500' },
    { id: 'perdida', title: 'Venda Perdida', color: 'bg-red-500' }
  ];

  const responsibles = [...new Set(leads.map(lead => lead.responsible))];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesResponsible = filterResponsible === 'all' || lead.responsible === filterResponsible;
    return matchesSearch && matchesResponsible;
  });

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  const moveLeadToStatus = (leadId: string, newStatus: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const updatedLead = { ...lead, status: newStatus as any };
      onUpdateLead(updatedLead);
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'quente': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'morno': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'frio': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">CRM Kanban</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterResponsible} onValueChange={setFilterResponsible}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os responsáveis</SelectItem>
              {responsibles.map(responsible => (
                <SelectItem key={responsible} value={responsible}>
                  {responsible}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        {columns.map(column => {
          const columnLeads = getLeadsByStatus(column.id);
          return (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {columnLeads.length}
                </Badge>
              </div>
              
              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnLeads.map(lead => (
                  <Card 
                    key={lead.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', lead.id);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{lead.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onSelectLead(lead)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Orçamento:</span>
                          <span className="font-medium">
                            R$ {lead.budgetValue.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {lead.responsible.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {lead.responsible}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getScoreColor(lead.leadScore)}`}
                          >
                            {lead.leadScore}
                          </Badge>
                          {lead.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Último contato: {new Date(lead.lastContact).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center text-sm text-muted-foreground min-h-[100px] flex items-center justify-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const leadId = e.dataTransfer.getData('text/plain');
                    moveLeadToStatus(leadId, column.id);
                  }}
                >
                  Arraste um lead aqui
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}