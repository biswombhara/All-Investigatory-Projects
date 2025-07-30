
'use client';

import { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card.jsx';
import { Skeleton } from '../ui/skeleton.jsx';
import { getPdfs, deletePdf } from '../../services/firestore.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Button } from '../ui/button.jsx';
import { ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
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
import { LoadingContext } from '../../context/LoadingContext.jsx';


export function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { showLoader, hideLoader } = useContext(LoadingContext);

  const fetchDocuments = async () => {
    setLoading(true);
    const fetchedDocs = await getPdfs();
    setDocuments(fetchedDocs);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (pdfId) => {
    showLoader();
    try {
      await deletePdf(pdfId);
      toast({ title: 'Document Deleted', description: 'The document has been removed.' });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete document", error);
      toast({ title: 'Error', description: 'Failed to delete the document.', variant: 'destructive' });
    } finally {
      hideLoader();
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Documents</CardTitle>
        <CardDescription>
          Review and delete uploaded documents.
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
                <TableHead>Uploaded At</TableHead>
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
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                       <a href={doc.url} target="_blank" rel="noopener noreferrer">
                         <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                       </a>
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
