import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ArrowLeft, Phone, MessageSquare, Calendar, DollarSign, Star, Tag, FileText, Send } from 'lucide-react';
import { LeadCalendarIntegration } from './lead-calendar-integration';
import type { Lead } from '../App';

interface LeadDetailsProps {
  lead: Lead;
  onBack: () => void;
  onUpdateLead: (lead: Lead) => void;
}

export function LeadDetails({ lead, onBack, onUpdateLead }: LeadDetailsProps) {
  const [editingLead, setEditingLead] = useState(lead);
  const [newMessage, setNewMessage] = useState('');

  const chatHistory = [
    { id: '1', sender: 'lead', message: 'Olá, gostaria de saber mais sobre os serviços', time: '10:30', date: '2024-01-15' },
    { id: '2', sender: 'user', message: 'Oi João! Claro, posso te ajudar. Que tipo de serviço você tem interesse?', time: '10:32', date: '2024-01-15' },
    { id: '3', sender: 'lead', message: 'Estou procurando uma solução completa para minha empresa', time: '10:35', date: '2024-01-15' },
    { id: '4', sender: 'user', message: 'Perfeito! Vou preparar uma proposta personalizada para você. Qual o tamanho da sua empresa?', time: '10:37', date: '2024-01-15' },
    { id: '5', sender: 'lead', message: 'Somos uma equipe de 25 pessoas', time: '10:40', date: '2024-01-15' },
  ];

  const attachments = [
    { name: 'Proposta_João_Silva.pdf', size: '2.1 MB', date: '2024-01-15' },
    { name: 'Apresentação_Serviços.pdf', size: '5.3 MB', date: '2024-01-14' },
  ];

  const handleSave = () => {
    onUpdateLead(editingLead);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would add the message to chat history
      setNewMessage('');
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <p className="text-muted-foreground">{lead.phone}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge className={getScoreColor(lead.leadScore)}>
            {lead.leadScore}
          </Badge>
          <Badge variant="outline">
            {lead.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Column */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Histórico de Conversas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.time} - {new Date(message.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          {/* Lead Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Informações do Lead
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome Completo</label>
                <Input
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={editingLead.phone}
                  onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={editingLead.status} 
                  onValueChange={(value: any) => setEditingLead({...editingLead, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo Lead</SelectItem>
                    <SelectItem value="qualificacao">Qualificação</SelectItem>
                    <SelectItem value="proposta">Proposta Enviada</SelectItem>
                    <SelectItem value="concluida">Venda Concluída</SelectItem>
                    <SelectItem value="perdida">Venda Perdida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Lead Score</label>
                <Select 
                  value={editingLead.leadScore} 
                  onValueChange={(value: any) => setEditingLead({...editingLead, leadScore: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quente">Quente</SelectItem>
                    <SelectItem value="morno">Morno</SelectItem>
                    <SelectItem value="frio">Frio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Responsável</label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {editingLead.responsible.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{editingLead.responsible}</span>
                </div>
              </div>
              
              <Button onClick={handleSave} className="w-full">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Valor do Orçamento</label>
                <Input
                  type="number"
                  value={editingLead.budgetValue}
                  onChange={(e) => setEditingLead({...editingLead, budgetValue: Number(e.target.value)})}
                />
              </div>
              
              {editingLead.status === 'concluida' && (
                <div>
                  <label className="text-sm font-medium">Valor da Venda</label>
                  <Input
                    type="number"
                    value={editingLead.saleValue || ''}
                    onChange={(e) => setEditingLead({...editingLead, saleValue: Number(e.target.value)})}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {editingLead.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Anexos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Integration */}
          <LeadCalendarIntegration 
            leadId={lead.id}
            leadName={lead.name}
            onEventCreated={(event) => {
              // Handle event creation if needed
              console.log('Evento criado:', event);
            }}
          />

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicionar observações..."
                value={editingLead.notes}
                onChange={(e) => setEditingLead({...editingLead, notes: e.target.value})}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}