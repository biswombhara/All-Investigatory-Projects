
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.jsx';
import { PdfRequestsTab } from './PdfRequestsTab.jsx';
import { ReviewsTab } from './ReviewsTab.jsx';
import { DocumentsTab } from './DocumentsTab.jsx';
import { CopyrightRequestsTab } from './CopyrightRequestsTab.jsx';
import { ConnectSubmissionsTab } from './ConnectSubmissionsTab.jsx';

export function AdminDashboard() {
  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="requests">PDF Requests</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="copyright">Copyright</TabsTrigger>
        <TabsTrigger value="connect">Connect</TabsTrigger>
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
      <TabsContent value="copyright">
        <CopyrightRequestsTab />
      </TabsContent>
      <TabsContent value="connect">
        <ConnectSubmissionsTab />
      </TabsContent>
    </Tabs>
  );
}
