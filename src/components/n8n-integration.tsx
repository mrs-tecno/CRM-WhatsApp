import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Plus, Settings, Zap, Link, PlayCircle, PauseCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface N8nIntegration {
  id: string;
  name: string;
  description: string;
  whatsappConnection: string;
  webhookUrl: string;
  status: 'active' | 'inactive' | 'error';
  triggerType: 'message_received' | 'lead_created' | 'status_changed';
  lastTriggered?: string;
  executionCount: number;
}

interface WebhookConfig {
  id: string;
  name: string;
  endpoint: string;
  method: 'POST' | 'GET';
  headers: Record<string, string>;
  isActive: boolean;
}

export function N8nIntegration() {
  const [integrations, setIntegrations] = useState<N8nIntegration[]>([
    {
      id: '1',
      name: 'Automação de Boas-vindas',
      description: 'Envia mensagem automática para novos leads',
      whatsappConnection: '+55 11 99999-0001',
      webhookUrl: 'https://webhook.n8n.io/webhook/abc123',
      status: 'active',
      triggerType: 'lead_created',
      lastTriggered: '2024-01-15 14:30',
      executionCount: 142
    },
    {
      id: '2',
      name: 'Notificação de Vendas',
      description: 'Notifica equipe quando venda é concluída',
      whatsappConnection: '+55 11 99999-0002',
      webhookUrl: 'https://webhook.n8n.io/webhook/def456',
      status: 'active',
      triggerType: 'status_changed',
      lastTriggered: '2024-01-15 13:45',
      executionCount: 89
    },
    {
      id: '3',
      name: 'Follow-up Automático',
      description: 'Envia follow-up após 24h sem resposta',
      whatsappConnection: '+55 11 99999-0001',
      webhookUrl: 'https://webhook.n8n.io/webhook/ghi789',
      status: 'inactive',
      triggerType: 'message_received',
      lastTriggered: '2024-01-14 09:20',
      executionCount: 267
    }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Webhook de Entrada Principal',
      endpoint: 'https://sua-empresa.com.br/webhook/whatsapp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      isActive: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<N8nIntegration | null>(null);
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);

  const whatsappConnections = [
    '+55 11 99999-0001',
    '+55 11 99999-0002',
    '+55 11 99999-0003'
  ];

  const triggerTypes = [
    { value: 'message_received', label: 'Mensagem Recebida' },
    { value: 'lead_created', label: 'Lead Criado' },
    { value: 'status_changed', label: 'Status Alterado' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <PauseCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleEdit = (integration: N8nIntegration) => {
    setEditingIntegration(integration);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingIntegration({
      id: 'new',
      name: '',
      description: '',
      whatsappConnection: whatsappConnections[0],
      webhookUrl: '',
      status: 'inactive',
      triggerType: 'message_received',
      executionCount: 0
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIntegration) {
      if (editingIntegration.id === 'new') {
        const newIntegration = {
          ...editingIntegration,
          id: Date.now().toString()
        };
        setIntegrations([...integrations, newIntegration]);
      } else {
        setIntegrations(integrations.map(i => i.id === editingIntegration.id ? editingIntegration : i));
      }
    }
    setIsDialogOpen(false);
    setEditingIntegration(null);
  };

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, status: integration.status === 'active' ? 'inactive' : 'active' }
        : integration
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const handleWebhookEdit = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setIsWebhookDialogOpen(true);
  };

  const handleWebhookSave = () => {
    if (editingWebhook) {
      if (editingWebhook.id === 'new') {
        const newWebhook = {
          ...editingWebhook,
          id: Date.now().toString()
        };
        setWebhooks([...webhooks, newWebhook]);
      } else {
        setWebhooks(webhooks.map(w => w.id === editingWebhook.id ? editingWebhook : w));
      }
    }
    setIsWebhookDialogOpen(false);
    setEditingWebhook(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Integração n8n</h2>
          <p className="text-muted-foreground">
            Configure automações e webhooks para cada conexão WhatsApp
          </p>
        </div>
      </div>

      <Tabs defaultValue="automations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="automations">Automações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks de Entrada</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Automações Configuradas</h3>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(integration.status)}
                        {integration.status === 'active' ? 'Ativo' : integration.status === 'inactive' ? 'Inativo' : 'Erro'}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">WhatsApp:</span>
                      <Badge variant="outline">{integration.whatsappConnection}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trigger:</span>
                      <span className="text-sm">
                        {triggerTypes.find(t => t.value === integration.triggerType)?.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Execuções:</span>
                      <span className="text-sm font-medium">{integration.executionCount}</span>
                    </div>
                    
                    {integration.lastTriggered && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Último trigger:</span>
                        <span className="text-sm">{integration.lastTriggered}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Webhook URL:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(integration.webhookUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                      {integration.webhookUrl}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(integration)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button 
                      variant={integration.status === 'active' ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleIntegrationStatus(integration.id)}
                    >
                      {integration.status === 'active' ? (
                        <PauseCircle className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Webhooks de Entrada</h3>
            <Button onClick={() => {
              setEditingWebhook({
                id: 'new',
                name: '',
                endpoint: '',
                method: 'POST',
                headers: {},
                isActive: true
              });
              setIsWebhookDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Webhook
            </Button>
          </div>

          <div className="grid gap-6">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-base">{webhook.name}</CardTitle>
                    </div>
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
                      {webhook.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Endpoint:</span>
                      <Badge variant="outline">{webhook.method}</Badge>
                    </div>
                    <div className="p-2 bg-muted rounded text-sm font-mono break-all">
                      {webhook.endpoint}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Headers:</span>
                    <div className="space-y-1">
                      {Object.entries(webhook.headers).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <code className="bg-muted px-2 py-1 rounded">{key}</code>
                          <span>:</span>
                          <code className="bg-muted px-2 py-1 rounded flex-1">{value}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleWebhookEdit(webhook)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(webhook.endpoint)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Automation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIntegration?.id === 'new' ? 'Nova Automação' : 'Editar Automação'}
            </DialogTitle>
            <DialogDescription>
              {editingIntegration?.id === 'new' 
                ? 'Configure uma nova automação n8n' 
                : 'Edite a configuração da automação selecionada'}
            </DialogDescription>
          </DialogHeader>
          
          {editingIntegration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Automação</Label>
                  <Input
                    id="name"
                    value={editingIntegration.name}
                    onChange={(e) => setEditingIntegration({...editingIntegration, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">Conexão WhatsApp</Label>
                  <Select 
                    value={editingIntegration.whatsappConnection} 
                    onValueChange={(value) => setEditingIntegration({...editingIntegration, whatsappConnection: value})}
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={editingIntegration.description}
                  onChange={(e) => setEditingIntegration({...editingIntegration, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="trigger">Tipo de Trigger</Label>
                <Select 
                  value={editingIntegration.triggerType} 
                  onValueChange={(value: any) => setEditingIntegration({...editingIntegration, triggerType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map(trigger => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        {trigger.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="webhook">URL do Webhook n8n</Label>
                <Input
                  id="webhook"
                  value={editingIntegration.webhookUrl}
                  onChange={(e) => setEditingIntegration({...editingIntegration, webhookUrl: e.target.value})}
                  placeholder="https://webhook.n8n.io/webhook/seu-webhook-id"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingIntegration.status === 'active'}
                  onCheckedChange={(checked) => setEditingIntegration({
                    ...editingIntegration, 
                    status: checked ? 'active' : 'inactive'
                  })}
                />
                <Label>Automação Ativa</Label>
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

      {/* Webhook Dialog */}
      <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWebhook?.id === 'new' ? 'Novo Webhook' : 'Editar Webhook'}
            </DialogTitle>
          </DialogHeader>
          
          {editingWebhook && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhookName">Nome</Label>
                <Input
                  id="webhookName"
                  value={editingWebhook.name}
                  onChange={(e) => setEditingWebhook({...editingWebhook, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="endpoint">Endpoint</Label>
                <Input
                  id="endpoint"
                  value={editingWebhook.endpoint}
                  onChange={(e) => setEditingWebhook({...editingWebhook, endpoint: e.target.value})}
                  placeholder="https://sua-empresa.com.br/webhook"
                />
              </div>
              
              <div>
                <Label htmlFor="method">Método HTTP</Label>
                <Select 
                  value={editingWebhook.method} 
                  onValueChange={(value: any) => setEditingWebhook({...editingWebhook, method: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingWebhook.isActive}
                  onCheckedChange={(checked) => setEditingWebhook({...editingWebhook, isActive: checked})}
                />
                <Label>Webhook Ativo</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWebhookDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleWebhookSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}