
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
import { getAllPdfRequests, updateRequestStatus } from '../../services/firestore.js';
import { Badge } from '../ui/badge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { LoadingContext } from '../../context/LoadingContext.jsx';

export function PdfRequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoadingContext);


  const fetchRequests = async () => {
    setLoading(true);
    const fetchedRequests = await getAllPdfRequests();
    setRequests(fetchedRequests);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    showLoader();
    try {
      await updateRequestStatus(requestId, newStatus);
      // Refresh the list to show the updated status
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      hideLoader();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Requests</CardTitle>
        <CardDescription>
          Manage and review all user-submitted PDF requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div>
                  <p className="font-semibold">{request.topic}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Requested by: {request.requesterName} ({request.requesterEmail})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge
                    variant={
                      request.status === 'completed'
                        ? 'default'
                        : request.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {request.status}
                  </Badge>
                  <Select
                    value={request.status}
                    onValueChange={(newStatus) => handleStatusChange(request.id, newStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No PDF requests found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
