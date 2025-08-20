
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

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn`

### 1. Installation

Install the project dependencies:
```bash
npm install
```
or
```bash
yarn install
```

### 2. Firebase Setup

This project relies heavily on Firebase. You will need to create your own Firebase project to run it locally.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your new project, go to **Project Settings** > **General**.
3.  Under "Your apps," click the web icon (`</>`) to create a new web app.
4.  Give it a nickname and click "Register app."
5.  Firebase will provide you with a `firebaseConfig` object. Copy this object.
6.  Navigate to `src/lib/firebase.js` in your project and replace the existing `firebaseConfig` object with the one you copied.
7.  In the Firebase Console, go to **Authentication** > **Sign-in method** and enable the **Google** provider. Make sure to add your email for testing.
8.  Go to **Firestore Database**, create a database, and start in **Test Mode** (you can secure it later with the provided `firestore.rules`).
9.  Go to **Storage** and create a default storage bucket.
10. To enable PDF uploads, you need to enable the **Google Drive API**. Go to the [Google Cloud Console](https://console.cloud.google.com/) for your project, navigate to **APIs & Services > Library**, search for "Google Drive API," and enable it.

### 3. Run the Development Server

Once your dependencies are installed and your Firebase project is configured, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

The project follows a standard Next.js App Router structure:

```
.
├── src
│   ├── app/                # All pages and routes
│   │   ├── admin/          # Admin dashboard page
│   │   ├── blogs/          # Blog listing, creation, and detail pages
│   │   ├── pdfs/           # PDF listing and detail pages
│   │   ├── (static)/       # All other static pages (About, Contact, etc.)
│   │   ├── globals.css     # Global stylesheet
│   │   └── layout.jsx      # Root layout
│   ├── components/         # Reusable React components
│   │   ├── admin/          # Components for the admin dashboard
│   │   ├── layout/         # Header and Footer
│   │   └── ui/             # ShadCN UI components
│   ├── context/            # React Context providers (Auth, Loading)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and Firebase setup
│   └── services/           # Firebase service functions (auth, firestore, storage)
├── public/                 # Static assets (images, robots.txt)
└── ...                     # Config files
```
