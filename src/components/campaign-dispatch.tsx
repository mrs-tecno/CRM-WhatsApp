import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Users, MessageSquare, Calendar, Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Campaign {
  id: string;
  name: string;
  message: string;
  segment: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  scheduledDate?: string;
  createdDate: string;
  whatsappConnection: string;
}

interface LeadSegment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  leadCount: number;
}

export function CampaignDispatch() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Follow-up Leads Inativos',
      message: 'Olá! Notamos que você demonstrou interesse em nossos serviços. Que tal conversarmos sobre como podemos ajudar?',
      segment: 'Leads sem contato há 7 dias',
      status: 'completed',
      targetCount: 45,
      sentCount: 45,
      deliveredCount: 42,
      readCount: 28,
      scheduledDate: '2024-01-15 09:00',
      createdDate: '2024-01-14',
      whatsappConnection: '+55 11 99999-0001'
    },
    {
      id: '2',
      name: 'Promoção de Janeiro',
      message: 'Aprovite nossa promoção especial de janeiro! Condições exclusivas para novos clientes. Entre em contato para saber mais!',
      segment: 'Todos os leads',
      status: 'scheduled',
      targetCount: 189,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      scheduledDate: '2024-01-16 14:00',
      createdDate: '2024-01-15',
      whatsappConnection: '+55 11 99999-0002'
    }
  ]);

  const [segments] = useState<LeadSegment[]>([
    {
      id: '1',
      name: 'Todos os leads',
      description: 'Todos os leads cadastrados no sistema',
      criteria: 'status != "perdida"',
      leadCount: 189
    },
    {
      id: '2',
      name: 'Leads sem contato há 7 dias',
      description: 'Leads que não recebem mensagens há mais de 7 dias',
      criteria: 'last_contact < 7 days ago',
      leadCount: 45
    },
    {
      id: '3',
      name: 'Leads VIP',
      description: 'Leads marcados com a tag VIP',
      criteria: 'tags contains "VIP"',
      leadCount: 12
    },
    {
      id: '4',
      name: 'Propostas em aberto',
      description: 'Leads com status "Proposta Enviada"',
      criteria: 'status = "proposta"',
      leadCount: 18
    },
    {
      id: '5',
      name: 'Leads Quentes',
      description: 'Leads com score "Quente"',
      criteria: 'lead_score = "quente"',
      leadCount: 67
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message: '',
    segment: '',
    whatsappConnection: '+55 11 99999-0001',
    scheduledDate: '',
    scheduledTime: ''
  });

  const whatsappConnections = [
    '+55 11 99999-0001',
    '+55 11 99999-0002',
    '+55 11 99999-0003'
  ];

  const predefinedMessages = [
    {
      name: 'Follow-up Padrão',
      message: 'Olá! Como está? Gostaria de saber se ainda tem interesse em nossos serviços. Estou aqui para esclarecer qualquer dúvida!'
    },
    {
      name: 'Oferta Especial',
      message: 'Oi! Temos uma oferta especial que pode interessar você. Que tal conversarmos sobre como posso ajudar?'
    },
    {
      name: 'Reagendamento',
      message: 'Olá! Percebi que perdemos o contato. Gostaria de reagendar nossa conversa? Estou disponível para quando for melhor para você.'
    },
    {
      name: 'Lembrete de Proposta',
      message: 'Oi! Espero que esteja bem. Queria saber se já teve tempo de analisar nossa proposta. Posso esclarecer alguma dúvida?'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'sending': return 'Enviando';
      case 'scheduled': return 'Agendada';
      case 'failed': return 'Falhou';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'sending': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleSendCampaign = () => {
    if (!newCampaign.name || !newCampaign.message || !newCampaign.segment) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const selectedSegment = segments.find(s => s.name === newCampaign.segment);
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      message: newCampaign.message,
      segment: newCampaign.segment,
      status: newCampaign.scheduledDate ? 'scheduled' : 'sending',
      targetCount: selectedSegment?.leadCount || 0,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      scheduledDate: newCampaign.scheduledDate ? `${newCampaign.scheduledDate} ${newCampaign.scheduledTime}` : undefined,
      createdDate: new Date().toISOString().split('T')[0],
      whatsappConnection: newCampaign.whatsappConnection
    };

    setCampaigns([campaign, ...campaigns]);
    setNewCampaign({
      name: '',
      message: '',
      segment: '',
      whatsappConnection: '+55 11 99999-0001',
      scheduledDate: '',
      scheduledTime: ''
    });

    toast.success(newCampaign.scheduledDate ? 'Campanha agendada com sucesso!' : 'Campanha enviada com sucesso!');
  };

  const calculateDeliveryRate = (campaign: Campaign) => {
    return campaign.sentCount > 0 ? Math.round((campaign.deliveredCount / campaign.sentCount) * 100) : 0;
  };

  const calculateReadRate = (campaign: Campaign) => {
    return campaign.deliveredCount > 0 ? Math.round((campaign.readCount / campaign.deliveredCount) * 100) : 0;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Disparos de Campanhas</h2>
          <p className="text-muted-foreground">
            Envie mensagens segmentadas para seus leads via WhatsApp
          </p>
        </div>
      </div>

      <Tabs defaultValue="new-campaign" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new-campaign">Nova Campanha</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
        </TabsList>

        <TabsContent value="new-campaign" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Criar Nova Campanha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaignName">Nome da Campanha *</Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Ex: Follow-up Janeiro"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsappConnection">Conexão WhatsApp *</Label>
                  <Select 
                    value={newCampaign.whatsappConnection} 
                    onValueChange={(value) => setNewCampaign({...newCampaign, whatsappConnection: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {whatsappConnections.map(connection => (
                        <SelectItem key={connection} value={connection}>
                          {connection}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="segment">Segmento de Leads *</Label>
                <Select 
                  value={newCampaign.segment} 
                  onValueChange={(value) => setNewCampaign({...newCampaign, segment: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map(segment => (
                      <SelectItem key={segment.id} value={segment.name}>
                        <div>
                          <div className="font-medium">{segment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {segment.leadCount} leads • {segment.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Select onValueChange={(value) => {
                    const predefined = predefinedMessages.find(m => m.name === value);
                    if (predefined) {
                      setNewCampaign({...newCampaign, message: predefined.message});
                    }
                  }}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Usar modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedMessages.map(msg => (
                        <SelectItem key={msg.name} value={msg.name}>
                          {msg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  id="message"
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                  placeholder="Digite sua mensagem aqui..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {newCampaign.message.length}/1000 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Agendar para (opcional)</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={newCampaign.scheduledDate}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="scheduledTime">Horário</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={newCampaign.scheduledTime}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledTime: e.target.value})}
                    disabled={!newCampaign.scheduledDate}
                  />
                </div>
              </div>

              {newCampaign.segment && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Resumo da Campanha</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Segmento:</strong> {newCampaign.segment}
                    </p>
                    <p>
                      <strong>Leads alvo:</strong> {segments.find(s => s.name === newCampaign.segment)?.leadCount || 0}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {newCampaign.whatsappConnection}
                    </p>
                    {newCampaign.scheduledDate && (
                      <p>
                        <strong>Agendado para:</strong> {new Date(newCampaign.scheduledDate + ' ' + newCampaign.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSendCampaign}
                className="w-full"
                disabled={!newCampaign.name || !newCampaign.message || !newCampaign.segment}
              >
                <Send className="h-4 w-4 mr-2" />
                {newCampaign.scheduledDate ? 'Agendar Campanha' : 'Enviar Agora'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {campaign.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Segmento: {campaign.segment} • WhatsApp: {campaign.whatsappConnection}
                      </p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(campaign.status)}
                        {getStatusText(campaign.status)}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{campaign.message}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.targetCount}</p>
                      <p className="text-sm text-muted-foreground">Alvo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.sentCount}</p>
                      <p className="text-sm text-muted-foreground">Enviadas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.deliveredCount}</p>
                      <p className="text-sm text-muted-foreground">Entregues</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{campaign.readCount}</p>
                      <p className="text-sm text-muted-foreground">Lidas</p>
                    </div>
                  </div>

                  {campaign.status === 'completed' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Entrega:</span>
                        <span>{calculateDeliveryRate(campaign)}%</span>
                      </div>
                      <Progress value={calculateDeliveryRate(campaign)} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Leitura:</span>
                        <span>{calculateReadRate(campaign)}%</span>
                      </div>
                      <Progress value={calculateReadRate(campaign)} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Criada em: {new Date(campaign.createdDate).toLocaleDateString()}</span>
                    {campaign.scheduledDate && (
                      <span>Agendada para: {new Date(campaign.scheduledDate).toLocaleString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {segment.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {segment.description}
                  </p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Leads:</span>
                      <Badge variant="outline">{segment.leadCount}</Badge>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">Critério:</span>
                      <code className="block mt-1 p-2 bg-muted rounded text-xs">
                        {segment.criteria}
                      </code>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setNewCampaign({...newCampaign, segment: segment.name})}
                    >
                      Usar neste Segmento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}