
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.jsx';
import { PdfRequestsTab } from './PdfRequestsTab.jsx';
import { ReviewsTab } from './ReviewsTab.jsx';
import { DocumentsTab } from './DocumentsTab.jsx';
import { CopyrightRequestsTab } from './CopyrightRequestsTab.jsx';
import { ConnectSubmissionsTab } from './ConnectSubmissionsTab.jsx';
import { BlogsTab } from './BlogsTab.jsx';
import { UsersTab } from './UsersTab.jsx';

export function AdminDashboard() {
  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-1 h-auto md:h-10 md:grid-cols-7">
        <TabsTrigger value="requests">PDF Requests</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="blogs">Blogs</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
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
      <TabsContent value="blogs">
        <BlogsTab />
      </TabsContent>
      <TabsContent value="users">
        <UsersTab />
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
