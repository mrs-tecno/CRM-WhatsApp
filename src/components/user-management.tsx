import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Plus, Search, Edit, Trash2, Users, MessageSquare, Shield, UserCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  whatsappConnections: string[];
  lastLogin: string;
  leadsCount: number;
  salesCount: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      role: 'admin',
      status: 'active',
      whatsappConnections: ['+55 11 99999-0001'],
      lastLogin: '2024-01-15 14:30',
      leadsCount: 45,
      salesCount: 12
    },
    {
      id: '2',
      name: 'Carlos Oliveira',
      email: 'carlos.oliveira@empresa.com',
      role: 'user',
      status: 'active',
      whatsappConnections: ['+55 11 99999-0002'],
      lastLogin: '2024-01-15 13:45',
      leadsCount: 38,
      salesCount: 15
    },
    {
      id: '3',
      name: 'Pedro Silva',
      email: 'pedro.silva@empresa.com',
      role: 'user',
      status: 'active',
      whatsappConnections: [],
      lastLogin: '2024-01-15 09:20',
      leadsCount: 29,
      salesCount: 7
    },
    {
      id: '4',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com',
      role: 'user',
      status: 'inactive',
      whatsappConnections: ['+55 11 99999-0003'],
      lastLogin: '2024-01-10 16:15',
      leadsCount: 33,
      salesCount: 10
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const availableConnections = [
    '+55 11 99999-0001',
    '+55 11 99999-0002',
    '+55 11 99999-0003',
    '+55 11 99999-0004'
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'user': return <UserCheck className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser({
      id: 'new',
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      whatsappConnections: [],
      lastLogin: '',
      leadsCount: 0,
      salesCount: 0
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      if (editingUser.id === 'new') {
        const newUser = {
          ...editingUser,
          id: Date.now().toString(),
          lastLogin: new Date().toLocaleString(),
          leadsCount: 0,
          salesCount: 0
        };
        setUsers([...users, newUser]);
      } else {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      }
    }
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.leadsCount > 0) {
      alert(`Não é possível excluir o usuário "${user.name}" pois ele possui ${user.leadsCount} leads atribuídos.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleConnection = (connection: string) => {
    if (!editingUser) return;
    
    const connections = editingUser.whatsappConnections.includes(connection)
      ? editingUser.whatsappConnections.filter(c => c !== connection)
      : [...editingUser.whatsappConnections, connection];
    
    setEditingUser({
      ...editingUser,
      whatsappConnections: connections
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie a equipe e permissões de acesso
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Com WhatsApp</p>
                <p className="text-2xl font-bold">{users.filter(u => u.whatsappConnections.length > 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(user.role)}
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {user.whatsappConnections.length === 0 ? (
                        <span className="text-sm text-muted-foreground">Nenhuma conexão</span>
                      ) : (
                        user.whatsappConnections.map((connection, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {connection}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.leadsCount}</TableCell>
                  <TableCell>{user.salesCount}</TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.leadsCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser?.id === 'new' ? 'Novo Usuário' : 'Editar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {editingUser?.id === 'new' 
                ? 'Adicione um novo usuário ao sistema' 
                : 'Edite as informações do usuário selecionado'}
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Papel</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value: any) => setEditingUser({...editingUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editingUser.status} 
                    onValueChange={(value: any) => setEditingUser({...editingUser, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Conexões WhatsApp</Label>
                <div className="mt-2 space-y-2">
                  {availableConnections.map((connection) => (
                    <div key={connection} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingUser.whatsappConnections.includes(connection)}
                        onChange={() => toggleConnection(connection)}
                        className="rounded"
                      />
                      <span className="text-sm">{connection}</span>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}