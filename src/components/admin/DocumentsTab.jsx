
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
import { getPdfs, updatePdfStatus, deletePdf } from '../../services/firestore.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Button } from '../ui/button.jsx';
import { Check, X, ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog.jsx';
import { useToast } from '../../hooks/use-toast.js';


export function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    setLoading(true);
    const fetchedDocs = await getPdfs();
    setDocuments(fetchedDocs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleStatusUpdate = async (pdfId, status) => {
    try {
      await updatePdfStatus(pdfId, status);
      toast({ title: 'Status Updated', description: `Document has been ${status}.` });
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Failed to update PDF status", error);
       toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleDelete = async (pdfId) => {
    try {
      await deletePdf(pdfId);
      toast({ title: 'Document Deleted', description: 'The document has been removed.' });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete document", error);
      toast({ title: 'Error', description: 'Failed to delete the document.', variant: 'destructive' });
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Documents</CardTitle>
        <CardDescription>
          Approve, reject, or view uploaded documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.subject}</TableCell>
                    <TableCell>{doc.authorName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doc.status === 'approved'
                            ? 'default'
                            : doc.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {doc.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <a href={doc.url} target="_blank" rel="noopener noreferrer">
                         <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                       </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(doc.id, 'approved')}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(doc.id, 'rejected')}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle /> Are you sure?
                              </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the document record from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-destructive hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No documents uploaded yet.
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
