
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.jsx';
import { PdfRequestsTab } from './PdfRequestsTab.jsx';
import { ReviewsTab } from './ReviewsTab.jsx';
import { DocumentsTab } from './DocumentsTab.jsx';

export function AdminDashboard() {
  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="requests">PDF Requests</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="requests">
        <PdfRequestsTab />
      </TabsContent>
      <TabsContent value="reviews">
        <ReviewsTab />
      </TabsContent>
      <TabsContent value="documents">
        <DocumentsTab />
      </TabsContent>
    </Tabs>
  );
}
