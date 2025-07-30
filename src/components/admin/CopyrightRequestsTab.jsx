
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
import { getAllCopyrightRequests, updateCopyrightRequestStatus } from '../../services/firestore.js';
import { Badge } from '../ui/badge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx';
import { LoadingContext } from '../../context/LoadingContext.jsx';
import { Button } from '../ui/button.jsx';
import { ExternalLink } from 'lucide-react';

export function CopyrightRequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useContext(LoadingContext);


  const fetchRequests = async () => {
    setLoading(true);
    const fetchedRequests = await getAllCopyrightRequests();
    setRequests(fetchedRequests);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    showLoader();
    try {
      await updateCopyrightRequestStatus(requestId, newStatus);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      hideLoader();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Copyright Removal Requests</CardTitle>
        <CardDescription>
          Review and manage copyright infringement claims.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="rounded-lg border p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                     <p className="font-semibold">Claim regarding URL:</p>
                      <a href={request.url} target="_blank" rel="noopener noreferrer">
                         <Button variant="outline" size="sm">
                            View Content <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                       </a>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Description:</span> {request.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Requested by: {request.requesterName} ({request.requesterEmail})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <Badge
                    variant={
                      request.status === 'resolved'
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
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No copyright requests found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
