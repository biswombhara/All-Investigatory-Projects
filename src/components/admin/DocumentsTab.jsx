
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
import { getPdfs, updatePdfStatus } from '../../services/firestore.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.jsx';
import { Button } from '../ui/button.jsx';
import { Check, X, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge.jsx';

export function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetchDocuments(); // Refresh list
    } catch (error) {
      console.error("Failed to update PDF status", error);
    }
  };


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
