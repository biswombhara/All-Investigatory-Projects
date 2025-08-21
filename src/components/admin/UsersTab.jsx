
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { getAllUsers } from '../../services/firestore.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.jsx';
import { format } from 'date-fns';

const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
};

export function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
        <CardDescription>
          A list of all users who have registered on the site, sorted by the most recent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.photoURL} alt={user.displayName} />
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <span>{user.displayName}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.createdAt ? format(user.createdAt.toDate(), 'PPP') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
