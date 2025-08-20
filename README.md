# All Investigatory Projects

This is a full-stack web application built to serve as a comprehensive library for educational resources, specifically investigatory projects and study notes. It allows users to browse, download, and contribute documents, read and write blog posts, and interact with the community. The platform is managed by an admin with a dedicated dashboard.

## Key Features

### For Users
- **Document Library**: Browse and filter a collection of PDFs by subject, class, title, or popularity (view count).
- **PDF Viewer**: View PDFs directly in the browser with an embedded viewer, and see related documents.
- **Upload & Share**: Authenticated users can upload their own PDF documents via Google Drive integration.
- **Request a PDF**: Users can request new documents they'd like to see on the platform.
- **Blog Platform**: A complete blog where users can read, create (with Markdown support), edit, like, and comment on posts.
- **User Reviews**: Users can leave reviews and ratings for the website.
- **User Profiles**: Users can log in via Google and manage their profile information.
- **Contact & Support**: Forms for general contact and for submitting copyright removal requests.
- **Responsive Design**: A modern, responsive UI that works on all devices, with light and dark mode support.

### For Admins
- **Admin Dashboard**: A private, centralized dashboard for site management.
- **Manage Submissions**: Review and manage PDF requests, contact messages, and copyright claims.
- **Document Management**: View all uploaded documents and delete them if necessary.
- **Blog Management**: Manage all blog posts and their comments, with the ability to delete content.
- **Review Moderation**: View and delete user-submitted reviews.
- **Site Analytics**: A simple visitor counter to track site reach.

## Tech Stack

This project is built with a modern, production-ready technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google Provider)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **File Storage**: [Google Drive API](https://developers.google.com/drive) (for PDF uploads)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Markdown Editor**: [UIW React MDEditor](https://www.npmjs.com/package/@uiw/react-md-editor)

## SEO Features

The application is built with Search Engine Optimization in mind:
- **Dynamic Metadata**: Page titles, descriptions, and keywords are dynamically generated for blog posts and the main layout.
- **`sitemap.xml`**: A sitemap is dynamically generated to include all static pages, PDF documents, and blog posts, helping search engines discover all content.
- **`robots.txt`**: A `robots.txt` file is included to guide search engine crawlers.
- **JSON-LD Structured Data**: Blog post pages include structured data to enhance search engine result listings.
