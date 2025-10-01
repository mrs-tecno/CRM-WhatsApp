import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Plus, QrCode, Smartphone, Settings, Trash2, Users } from 'lucide-react';

interface WhatsAppConnection {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'pending';
  assignedUser: string;
  lastActivity: string;
  messagesCount: number;
}

export function WhatsAppConnections() {
  const [connections, setConnections] = useState<WhatsAppConnection[]>([
    {
      id: '1',
      name: 'WhatsApp Vendas',
      phone: '+55 11 99999-0001',
      status: 'connected',
      assignedUser: 'Ana Costa',
      lastActivity: '2024-01-15 14:30',
      messagesCount: 1250
    },
    {
      id: '2',
      name: 'WhatsApp Suporte',
      phone: '+55 11 99999-0002',
      status: 'connected',
      assignedUser: 'Carlos Oliveira',
      lastActivity: '2024-01-15 13:45',
      messagesCount: 890
    },
    {
      id: '3',
      name: 'WhatsApp Marketing',
      phone: '+55 11 99999-0003',
      status: 'disconnected',
      assignedUser: 'Não atribuído',
      lastActivity: '2024-01-14 10:20',
      messagesCount: 0
    }
  ]);

  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<WhatsAppConnection | null>(null);

  const users = ['Ana Costa', 'Carlos Oliveira', 'Pedro Silva', 'Maria Santos'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'disconnected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const handleAddConnection = () => {
    const newConnection: WhatsAppConnection = {
      id: Date.now().toString(),
      name: `WhatsApp ${connections.length + 1}`,
      phone: '',
      status: 'pending',
      assignedUser: 'Não atribuído',
      lastActivity: new Date().toLocaleString(),
      messagesCount: 0
    };
    setConnections([...connections, newConnection]);
    setSelectedConnection(newConnection);
    setShowQRCode(true);
  };

  const handleDeleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
  };

  const handleAssignUser = (connectionId: string, userId: string) => {
    setConnections(connections.map(conn => 
      conn.id === connectionId 
        ? { ...conn, assignedUser: userId }
        : conn
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Conexões WhatsApp</h2>
          <p className="text-muted-foreground">
            Gerencie múltiplas conexões WhatsApp para sua equipe
          </p>
        </div>
        <Button onClick={handleAddConnection}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Conexão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map(connection => (
          <Card key={connection.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                    {connection.phone && (
                      <p className="text-sm text-muted-foreground">{connection.phone}</p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(connection.status)}>
                  {getStatusText(connection.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Responsável:</span>
                <div className="flex items-center gap-2">
                  {connection.assignedUser !== 'Não atribuído' ? (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {connection.assignedUser.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{connection.assignedUser}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Não atribuído</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mensagens:</span>
                <span className="text-sm font-medium">{connection.messagesCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Última atividade:</span>
                <span className="text-sm">{connection.lastActivity}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Select 
                  value={connection.assignedUser}
                  onValueChange={(value) => handleAssignUser(connection.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Atribuir usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Não atribuído">Não atribuído</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user} value={user}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {user}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    setSelectedConnection(connection);
                    setShowQRCode(true);
                  }}
                >
                  <QrCode className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  size="icon"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDeleteConnection(connection.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            <DialogDescription>
              Conecte sua conta do WhatsApp para integração com o CRM
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code abaixo com o WhatsApp Web para conectar esta instância:
            </p>
            
            <div className="flex justify-center p-8 bg-muted rounded-lg">
              <div className="w-48 h-48 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Como conectar:</p>
              <ol className="text-sm text-muted-foreground space-y-1 text-left">
                <li>1. Abra o WhatsApp no seu celular</li>
                <li>2. Toque em Mais opções → Dispositivos conectados</li>
                <li>3. Toque em Conectar um dispositivo</li>
                <li>4. Aponte o celular para esta tela para capturar o código</li>
              </ol>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowQRCode(false)}>
                Cancelar
              </Button>
              <Button className="flex-1">
                Aguardando conexão...
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}