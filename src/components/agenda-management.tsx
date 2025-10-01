import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Phone, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'followup' | 'presentation' | 'other';
  location?: string;
  attendees: string[];
  leadId?: string;
  isGoogleEvent: boolean;
  googleEventId?: string;
  googleSyncStatus: 'synced' | 'pending' | 'error';
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  reminderMinutes: number;
}

interface GoogleCalendarSettings {
  isConnected: boolean;
  connectedEmail: string;
  autoSync: boolean;
  defaultCalendar: string;
  syncDirection: 'both' | 'to_google' | 'from_google';
  lastSync?: string;
}

export function AgendaManagement() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Reunião com João Silva',
      description: 'Apresentação da proposta comercial',
      startDate: '2024-01-16',
      endDate: '2024-01-16',
      startTime: '14:00',
      endTime: '15:00',
      type: 'meeting',
      location: 'Sala de reuniões',
      attendees: ['João Silva', 'Ana Costa'],
      leadId: '1',
      isGoogleEvent: true,
      googleEventId: 'google-event-1',
      googleSyncStatus: 'synced',
      recurrence: 'none',
      reminderMinutes: 15
    },
    {
      id: '2',
      title: 'Follow-up Maria Santos',
      description: 'Acompanhamento da proposta enviada',
      startDate: '2024-01-17',
      endDate: '2024-01-17',
      startTime: '10:30',
      endTime: '11:00',
      type: 'call',
      attendees: ['Maria Santos'],
      leadId: '2',
      isGoogleEvent: true,
      googleEventId: 'google-event-2',
      googleSyncStatus: 'synced',
      recurrence: 'none',
      reminderMinutes: 10
    },
    {
      id: '3',
      title: 'Apresentação Produto',
      description: 'Demo do produto para Pedro Almeida',
      startDate: '2024-01-18',
      endDate: '2024-01-18',
      startTime: '16:00',
      endTime: '17:00',
      type: 'presentation',
      location: 'Google Meet',
      attendees: ['Pedro Almeida', 'Equipe Técnica'],
      leadId: '3',
      isGoogleEvent: false,
      googleSyncStatus: 'pending',
      recurrence: 'none',
      reminderMinutes: 30
    }
  ]);

  const [googleSettings, setGoogleSettings] = useState<GoogleCalendarSettings>({
    isConnected: true,
    connectedEmail: 'usuario@empresa.com',
    autoSync: true,
    defaultCalendar: 'primary',
    syncDirection: 'both',
    lastSync: '2024-01-15 14:30'
  });

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const eventTypes = [
    { value: 'meeting', label: 'Reunião', color: 'bg-blue-500' },
    { value: 'call', label: 'Ligação', color: 'bg-green-500' },
    { value: 'followup', label: 'Follow-up', color: 'bg-yellow-500' },
    { value: 'presentation', label: 'Apresentação', color: 'bg-purple-500' },
    { value: 'other', label: 'Outro', color: 'bg-gray-500' }
  ];

  const availableLeads = [
    { id: '1', name: 'João Silva' },
    { id: '2', name: 'Maria Santos' },
    { id: '3', name: 'Pedro Almeida' },
    { id: '4', name: 'Carla Ferreira' }
  ];

  const getEventTypeColor = (type: string) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Sincronizado';
      case 'pending': return 'Pendente';
      case 'error': return 'Erro na sync';
      default: return status;
    }
  };

  const handleAddEvent = () => {
    setEditingEvent({
      id: 'new',
      title: '',
      description: '',
      startDate: selectedDate || new Date().toISOString().split('T')[0],
      endDate: selectedDate || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      attendees: [],
      isGoogleEvent: googleSettings.autoSync,
      googleSyncStatus: 'pending',
      recurrence: 'none',
      reminderMinutes: 15
    });
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!editingEvent) return;

    if (!editingEvent.title || !editingEvent.startDate || !editingEvent.startTime) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingEvent.id === 'new') {
      const newEvent = {
        ...editingEvent,
        id: Date.now().toString(),
        googleSyncStatus: googleSettings.autoSync && googleSettings.isConnected ? 'pending' : 'synced'
      } as CalendarEvent;
      setEvents([...events, newEvent]);
      
      if (googleSettings.autoSync && googleSettings.isConnected) {
        // Simulate Google Calendar sync
        setTimeout(() => {
          setEvents(prev => prev.map(e => 
            e.id === newEvent.id 
              ? { ...e, googleSyncStatus: 'synced', googleEventId: `google-${Date.now()}` }
              : e
          ));
          toast.success('Evento sincronizado com Google Calendar');
        }, 2000);
      }
    } else {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...editingEvent, googleSyncStatus: editingEvent.isGoogleEvent ? 'pending' : 'synced' }
          : e
      ));
      
      if (editingEvent.isGoogleEvent && googleSettings.isConnected) {
        // Simulate Google Calendar sync
        setTimeout(() => {
          setEvents(prev => prev.map(e => 
            e.id === editingEvent.id 
              ? { ...e, googleSyncStatus: 'synced' }
              : e
          ));
          toast.success('Evento atualizado no Google Calendar');
        }, 2000);
      }
    }

    setIsEventDialogOpen(false);
    setEditingEvent(null);
    toast.success(editingEvent.id === 'new' ? 'Evento criado com sucesso!' : 'Evento atualizado com sucesso!');
  };

  const handleDeleteEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event && confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== id));
      
      if (event.isGoogleEvent && googleSettings.isConnected) {
        toast.success('Evento removido do Google Calendar');
      } else {
        toast.success('Evento excluído');
      }
    }
  };

  const handleGoogleSync = () => {
    if (!googleSettings.isConnected) {
      toast.error('Conecte-se ao Google Calendar primeiro');
      return;
    }

    // Simulate sync process
    toast.info('Sincronizando com Google Calendar...');
    setTimeout(() => {
      setGoogleSettings(prev => ({
        ...prev,
        lastSync: new Date().toLocaleString()
      }));
      
      // Update pending events to synced
      setEvents(prev => prev.map(event => ({
        ...event,
        googleSyncStatus: 'synced' as const
      })));
      
      toast.success('Sincronização concluída');
    }, 3000);
  };

  const handleConnectGoogle = () => {
    // Simulate Google OAuth connection
    toast.info('Conectando ao Google Calendar...');
    setTimeout(() => {
      setGoogleSettings(prev => ({
        ...prev,
        isConnected: true,
        connectedEmail: 'usuario@empresa.com',
        lastSync: new Date().toLocaleString()
      }));
      toast.success('Conectado ao Google Calendar com sucesso!');
    }, 2000);
  };

  const handleDisconnectGoogle = () => {
    if (confirm('Tem certeza que deseja desconectar do Google Calendar?')) {
      setGoogleSettings(prev => ({
        ...prev,
        isConnected: false,
        connectedEmail: '',
        lastSync: undefined
      }));
      toast.success('Desconectado do Google Calendar');
    }
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.startDate === date);
  };

  const formatEventTime = (event: CalendarEvent) => {
    return `${event.startTime} - ${event.endTime}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    if (currentView === 'day') {
      return currentDate.toLocaleDateString('pt-BR', {
        ...options,
        day: 'numeric'
      });
    }
    
    return currentDate.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Agenda</h2>
          <p className="text-muted-foreground">
            Gerencie seus compromissos integrados com Google Calendar
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGoogleSync}
            disabled={!googleSettings.isConnected}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
          
          <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Google Calendar Status */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${googleSettings.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">
                  Google Calendar: {googleSettings.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              
              {googleSettings.isConnected && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{googleSettings.connectedEmail}</span>
                  {googleSettings.lastSync && (
                    <span>Última sync: {googleSettings.lastSync}</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {googleSettings.isConnected ? (
                <Button variant="outline" size="sm" onClick={handleDisconnectGoogle}>
                  Desconectar
                </Button>
              ) : (
                <Button size="sm" onClick={handleConnectGoogle}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Conectar Google
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold min-w-48 text-center">
              {getDateRangeText()}
            </h3>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
        </div>
        
        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)}>
          <TabsList>
            <TabsTrigger value="day">Dia</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Calendar Views */}
      <Tabs value={currentView} className="space-y-6">
        <TabsContent value="month">
          <MonthView 
            currentDate={currentDate}
            events={events}
            onEventClick={handleEditEvent}
            onDateClick={setSelectedDate}
            onAddEvent={handleAddEvent}
            getEventTypeColor={getEventTypeColor}
            getSyncStatusIcon={getSyncStatusIcon}
          />
        </TabsContent>
        
        <TabsContent value="week">
          <WeekView 
            currentDate={currentDate}
            events={events}
            onEventClick={handleEditEvent}
            getEventTypeColor={getEventTypeColor}
            getSyncStatusIcon={getSyncStatusIcon}
            formatEventTime={formatEventTime}
          />
        </TabsContent>
        
        <TabsContent value="day">
          <DayView 
            currentDate={currentDate}
            events={events}
            onEventClick={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            getEventTypeColor={getEventTypeColor}
            getSyncStatusIcon={getSyncStatusIcon}
            formatEventTime={formatEventTime}
          />
        </TabsContent>
      </Tabs>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent?.id === 'new' ? 'Novo Evento' : 'Editar Evento'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent?.id === 'new' 
                ? 'Crie um novo evento na sua agenda' 
                : 'Edite os detalhes do evento selecionado'}
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select 
                    value={editingEvent.type} 
                    onValueChange={(value: any) => setEditingEvent({...editingEvent, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`} />
                            {type.label}
                          </div>
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
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingEvent.startDate}
                    onChange={(e) => setEditingEvent({...editingEvent, startDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Data Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingEvent.endDate}
                    onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora Início *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={editingEvent.startTime}
                    onChange={(e) => setEditingEvent({...editingEvent, startTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime">Hora Fim *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={editingEvent.endTime}
                    onChange={(e) => setEditingEvent({...editingEvent, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Local/Link</Label>
                <Input
                  id="location"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                  placeholder="Sala de reuniões, Google Meet, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="leadId">Lead Relacionado</Label>
                <Select 
                  value={editingEvent.leadId || ''} 
                  onValueChange={(value) => setEditingEvent({...editingEvent, leadId: value || undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar lead (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum lead</SelectItem>
                    {availableLeads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder">Lembrete (minutos)</Label>
                  <Select 
                    value={editingEvent.reminderMinutes.toString()} 
                    onValueChange={(value) => setEditingEvent({...editingEvent, reminderMinutes: Number(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sem lembrete</SelectItem>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="recurrence">Recorrência</Label>
                  <Select 
                    value={editingEvent.recurrence || 'none'} 
                    onValueChange={(value: any) => setEditingEvent({...editingEvent, recurrence: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem recorrência</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingEvent.isGoogleEvent}
                  onCheckedChange={(checked) => setEditingEvent({...editingEvent, isGoogleEvent: checked})}
                  disabled={!googleSettings.isConnected}
                />
                <Label>Sincronizar com Google Calendar</Label>
                {!googleSettings.isConnected && (
                  <span className="text-sm text-muted-foreground">(Google não conectado)</span>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEvent}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurações da Agenda</DialogTitle>
            <DialogDescription>
              Configure as opções de integração com Google Calendar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Status da Conexão</Label>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${googleSettings.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span>{googleSettings.isConnected ? 'Conectado' : 'Desconectado'}</span>
                </div>
                {googleSettings.isConnected && (
                  <Badge variant="outline">{googleSettings.connectedEmail}</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={googleSettings.autoSync}
                onCheckedChange={(checked) => setGoogleSettings({...googleSettings, autoSync: checked})}
                disabled={!googleSettings.isConnected}
              />
              <Label>Sincronização Automática</Label>
            </div>
            
            <div>
              <Label htmlFor="syncDirection">Direção da Sincronização</Label>
              <Select 
                value={googleSettings.syncDirection} 
                onValueChange={(value: any) => setGoogleSettings({...googleSettings, syncDirection: value})}
                disabled={!googleSettings.isConnected}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Bidirecional</SelectItem>
                  <SelectItem value="to_google">Apenas para Google</SelectItem>
                  <SelectItem value="from_google">Apenas do Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {googleSettings.lastSync && (
              <div className="text-sm text-muted-foreground">
                Última sincronização: {googleSettings.lastSync}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsSettingsDialogOpen(false);
              toast.success('Configurações salvas');
            }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Month View Component
function MonthView({ currentDate, events, onEventClick, onDateClick, onAddEvent, getEventTypeColor, getSyncStatusIcon }: any) {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  while (current <= endOfMonth || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <div className="bg-card rounded-lg border">
      <div className="grid grid-cols-7 border-b">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-3 text-center font-medium border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = events.filter((e: any) => e.startDate === dateStr);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          
          return (
            <div 
              key={index} 
              className={`min-h-24 p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-muted/50 ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday ? 'bg-primary/5' : ''}`}
              onClick={() => {
                onDateClick(dateStr);
                onAddEvent();
              }}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event: any) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded cursor-pointer ${getEventTypeColor(event.type)} text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {getSyncStatusIcon(event.googleSyncStatus)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({ currentDate, events, onEventClick, getEventTypeColor, getSyncStatusIcon, formatEventTime }: any) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  return (
    <div className="bg-card rounded-lg border">
      <div className="grid grid-cols-7 border-b">
        {days.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = events.filter((e: any) => e.startDate === dateStr);
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          
          return (
            <div key={index} className="p-4 border-r last:border-r-0">
              <div className={`text-center mb-3 ${isToday ? 'text-primary font-semibold' : ''}`}>
                <div className="text-sm text-muted-foreground">
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className="text-lg">{day.getDate()}</div>
              </div>
              
              <div className="space-y-2">
                {dayEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded cursor-pointer ${getEventTypeColor(event.type)} text-white`}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      {getSyncStatusIcon(event.googleSyncStatus)}
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <div className="opacity-90">{formatEventTime(event)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Day View Component
function DayView({ currentDate, events, onEventClick, onDeleteEvent, getEventTypeColor, getSyncStatusIcon, formatEventTime }: any) {
  const dateStr = currentDate.toISOString().split('T')[0];
  const dayEvents = events.filter((e: any) => e.startDate === dateStr);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento agendado para este dia
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event: any) => (
                <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type)} mt-1`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{event.title}</h3>
                            {getSyncStatusIcon(event.googleSyncStatus)}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatEventTime(event)}
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                            
                            {event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {event.attendees.length} participantes
                              </div>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {event.description}
                            </p>
                          )}
                          
                          {event.attendees.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Participantes:</span>
                              <div className="flex gap-1">
                                {event.attendees.slice(0, 3).map((attendee: string, index: number) => (
                                  <Avatar key={index} className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {attendee.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {event.attendees.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{event.attendees.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEventClick(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDeleteEvent(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}