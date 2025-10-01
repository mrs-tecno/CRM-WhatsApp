import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar, Clock, MapPin, Users, Video, Phone, Plus, ArrowRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'followup' | 'presentation';
  location?: string;
  attendees: string[];
  leadName?: string;
}

interface AgendaWidgetProps {
  onViewAll?: () => void;
  onAddEvent?: () => void;
}

export function AgendaWidget({ onViewAll, onAddEvent }: AgendaWidgetProps) {
  const todayEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Reunião com João Silva',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      type: 'meeting',
      location: 'Sala de reuniões',
      attendees: ['João Silva'],
      leadName: 'João Silva'
    },
    {
      id: '2',
      title: 'Follow-up Maria Santos',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '16:30',
      endTime: '17:00',
      type: 'call',
      attendees: ['Maria Santos'],
      leadName: 'Maria Santos'
    }
  ];

  const upcomingEvents: CalendarEvent[] = [
    {
      id: '3',
      title: 'Apresentação Produto',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      type: 'presentation',
      location: 'Google Meet',
      attendees: ['Pedro Almeida', 'Equipe Técnica'],
      leadName: 'Pedro Almeida'
    },
    {
      id: '4',
      title: 'Reunião de Alinhamento',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '09:30',
      type: 'meeting',
      attendees: ['Equipe Vendas']
    }
  ];

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'presentation': return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'call': return 'bg-green-500';
      case 'followup': return 'bg-yellow-500';
      case 'presentation': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Hoje';
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Amanhã';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const isEventSoon = (event: CalendarEvent) => {
    const now = new Date();
    const eventDateTime = new Date(`${event.startDate}T${event.startTime}`);
    const timeDiff = eventDateTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // 30 minutes
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda
          </CardTitle>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onAddEvent}>
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={onViewAll}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Today's Events */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-medium">Hoje</h4>
            <Badge variant="secondary">{todayEvents.length}</Badge>
          </div>
          
          {todayEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Nenhum evento hoje
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                    isEventSoon(event) ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center text-white flex-shrink-0`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{event.title}</div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatEventTime(event.startTime, event.endTime)}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-20">{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.attendees.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-1">
                          {event.attendees.slice(0, 2).map((attendee, index) => (
                            <Avatar key={index} className="h-5 w-5 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {attendee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {event.attendees.length > 2 && (
                            <div className="w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs">+{event.attendees.length - 2}</span>
                            </div>
                          )}
                        </div>
                        
                        {event.leadName && (
                          <Badge variant="outline" className="text-xs">
                            Lead: {event.leadName}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {isEventSoon(event) && (
                      <Badge variant="secondary" className="text-xs mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Em breve
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-medium">Próximos</h4>
            <Badge variant="secondary">{upcomingEvents.length}</Badge>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Nenhum evento próximo
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-6 h-6 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center text-white flex-shrink-0`}>
                    {getEventTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{event.title}</div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{formatEventDate(event.startDate)}</span>
                      <span>•</span>
                      <span>{formatEventTime(event.startTime, event.endTime)}</span>
                    </div>
                    
                    {event.leadName && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {event.leadName}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {upcomingEvents.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" onClick={onViewAll}>
                    Ver mais {upcomingEvents.length - 3} eventos
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}