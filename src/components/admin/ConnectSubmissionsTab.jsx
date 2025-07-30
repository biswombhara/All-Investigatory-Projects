
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
import { getAllContactSubmissions, updateContactSubmissionStatus } from '../../services/firestore.js';
import { Badge } from '../ui/badge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { LoadingContext } from '../../context/LoadingContext.jsx';

export function ConnectSubmissionsTab() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoadingContext);


  const fetchSubmissions = async () => {
    setLoading(true);
    const fetchedSubmissions = await getAllContactSubmissions();
    setSubmissions(fetchedSubmissions);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (submissionId, newStatus) => {
    showLoader();
    try {
      await updateContactSubmissionStatus(submissionId, newStatus);
      fetchSubmissions(); // Refresh list
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      hideLoader();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Submissions</CardTitle>
        <CardDescription>
          Review messages from the "Connect" page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : submissions.length > 0 ? (
          submissions.map((submission) => (
            <div key={submission.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{submission.topic}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    From: {submission.senderName} ({submission.senderEmail})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge
                    variant={
                      submission.status === 'read'
                        ? 'default'
                        : submission.status === 'archived'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {submission.status}
                  </Badge>
                  <Select
                    value={submission.status}
                    onValueChange={(newStatus) => handleStatusChange(submission.id, newStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No submissions found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
