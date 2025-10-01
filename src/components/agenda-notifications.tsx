import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, Calendar, Clock, MapPin, Users } from 'lucide-react';

interface UpcomingEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'followup' | 'presentation';
  location?: string;
  attendees: string[];
  minutesUntil: number;
}

export function AgendaNotifications() {
  const [upcomingEvents] = useState<UpcomingEvent[]>([
    {
      id: '1',
      title: 'Reunião com João Silva',
      startTime: '14:00',
      endTime: '15:00',
      type: 'meeting',
      location: 'Sala de reuniões',
      attendees: ['João Silva'],
      minutesUntil: 15
    },
    {
      id: '2',
      title: 'Follow-up Maria Santos',
      startTime: '16:30',
      endTime: '17:00',
      type: 'call',
      attendees: ['Maria Santos'],
      minutesUntil: 45
    }
  ]);

  const urgentEvents = upcomingEvents.filter(event => event.minutesUntil <= 30);
  const hasUrgentEvents = urgentEvents.length > 0;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'call': return 'bg-green-500';
      case 'followup': return 'bg-yellow-500';
      case 'presentation': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeUntilText = (minutes: number) => {
    if (minutes <= 0) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getUrgencyLevel = (minutes: number) => {
    if (minutes <= 5) return 'critical';
    if (minutes <= 15) return 'urgent';
    if (minutes <= 30) return 'soon';
    return 'normal';
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'urgent': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'soon': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return '';
    }
  };

  if (upcomingEvents.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {hasUrgentEvents && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {urgentEvents.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h4 className="font-semibold">Próximos Eventos</h4>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map((event) => {
              const urgencyLevel = getUrgencyLevel(event.minutesUntil);
              const urgencyColorClass = getUrgencyColor(urgencyLevel);
              
              return (
                <div 
                  key={event.id} 
                  className={`p-3 rounded-lg border transition-colors ${urgencyColorClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${getEventTypeColor(event.type)} flex items-center justify-center text-white flex-shrink-0`}>
                      <Calendar className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{event.title}</div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.startTime} - {event.endTime}
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
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <Badge 
                          variant={urgencyLevel === 'critical' || urgencyLevel === 'urgent' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {urgencyLevel === 'critical' ? 'Começando agora!' : 
                           urgencyLevel === 'urgent' ? `Em ${getTimeUntilText(event.minutesUntil)}` :
                           `Em ${getTimeUntilText(event.minutesUntil)}`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 border-t">
            <Button variant="outline" className="w-full" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ver todos os eventos
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}