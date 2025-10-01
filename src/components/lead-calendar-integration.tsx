import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Calendar, Clock, MapPin, Plus, Edit, Video, Phone, Users } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'followup' | 'presentation';
  location?: string;
  googleEventId?: string;
}

interface LeadCalendarProps {
  leadId: string;
  leadName: string;
  onEventCreated?: (event: CalendarEvent) => void;
}

export function LeadCalendarIntegration({ leadId, leadName, onEventCreated }: LeadCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: `Reunião com ${leadName}`,
      description: 'Apresentação da proposta comercial',
      startDate: '2024-01-16',
      startTime: '14:00',
      endTime: '15:00',
      type: 'meeting',
      location: 'Sala de reuniões',
      googleEventId: 'google-event-1'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: `Reunião com ${leadName}`,
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    type: 'meeting' as const,
    location: ''
  });

  const eventTypes = [
    { value: 'meeting', label: 'Reunião', icon: Users, color: 'bg-blue-500' },
    { value: 'call', label: 'Ligação', icon: Phone, color: 'bg-green-500' },
    { value: 'followup', label: 'Follow-up', icon: Clock, color: 'bg-yellow-500' },
    { value: 'presentation', label: 'Apresentação', icon: Video, color: 'bg-purple-500' }
  ];

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.startTime) {
      return;
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      ...newEvent,
      googleEventId: `google-${Date.now()}`
    };

    setEvents([...events, event]);
    onEventCreated?.(event);
    setIsDialogOpen(false);
    setNewEvent({
      title: `Reunião com ${leadName}`,
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      location: ''
    });
  };

  const getEventTypeInfo = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const formatEventDateTime = (date: string, startTime: string, endTime: string) => {
    const eventDate = new Date(date);
    return `${eventDate.toLocaleDateString('pt-BR')} • ${startTime} - ${endTime}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos Agendados
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agendar Evento - {leadName}</DialogTitle>
                <DialogDescription>
                  Crie um novo evento na agenda para este lead.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventTitle">Título</Label>
                  <Input
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventType">Tipo</Label>
                  <Select 
                    value={newEvent.type} 
                    onValueChange={(value: any) => setNewEvent({...newEvent, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="eventDescription">Descrição</Label>
                  <Textarea
                    id="eventDescription"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventDate">Data</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora Início</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">Hora Fim</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="eventLocation">Local/Link</Label>
                  <Input
                    id="eventLocation"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Sala de reuniões, Google Meet, etc."
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateEvent} className="flex-1">
                  Agendar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Nenhum evento agendado
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const typeInfo = getEventTypeInfo(event.type);
              const Icon = typeInfo.icon;
              
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-8 h-8 rounded-full ${typeInfo.color} flex items-center justify-center text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{event.title}</div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatEventDateTime(event.startDate, event.startTime, event.endTime)}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                    
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {typeInfo.label}
                      </Badge>
                      
                      {event.googleEventId && (
                        <Badge variant="secondary" className="text-xs">
                          Google Calendar
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}