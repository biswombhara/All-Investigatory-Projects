
'use client';

import { useState, useEffect } from 'react';
import { EbookList } from '../../components/EbookList.jsx';
import { Input } from '../../components/ui/input.jsx';
import { getEbooks } from '../../services/firestore.js';
import { Search, ListFilter } from 'lucide-react';
import { Loader } from '../../components/Loader.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select.jsx';
import { useSearchParams } from 'next/navigation.js';


const allSubjectsList = [
  'All',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Science',
  'Physical Education',
  'Economics',
  'Computer science',
];

const allClassesList = [
    'All',
    '9th',
    '10th',
    '11th',
    '12th',
    'College ( Any UG & PG )',
    'School ( 4th - 8th )',
];

const sortOptions = ['Latest uploaded', 'Popularity', 'A-Z'];

const demoEbooks = [
  {
    id: 'demo-1',
    title: 'Demo E-Book: The Principles of Physics',
    coverImage: 'https://placehold.co/400x600/E5E7EB/4B5563/png?text=Physics+E-Book',
    views: 123,
    subject: 'Physics',
    class: '12th',
    viewUrl: '#',
  },
  {
    id: 'demo-2',
    title: 'Demo E-Book: Advanced Chemistry',
    coverImage: 'https://placehold.co/400x600/E5E7EB/4B5563/png?text=Chemistry+E-Book',
    views: 456,
    subject: 'Chemistry',
    class: 'College ( Any UG & PG )',
    viewUrl: '#',
  },
  {
    id: 'demo-3',
    title: 'Demo E-Book: A Guide to Modern Mathematics',
    coverImage: 'https://placehold.co/400x600/E5E7EB/4B5563/png?text=Math+E-Book',
    views: 789,
    subject: 'Mathematics',
    class: '11th',
    viewUrl: '#',
  },
  {
    id: 'demo-4',
    title: 'Physics Note',
    coverImage: 'https://placehold.co/400x600/E5E7EB/4B5563/png?text=Physics+Note',
    views: 250,
    subject: 'Physics',
    class: '12th',
    viewUrl: 'https://example.com/physics-note',
  },
];


export default function EBooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialSubject = searchParams.get('subject') || 'All';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState('All');
  const [sortOption, setSortOption] = useState(sortOptions[0]);

  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      try {
        let fetchedEbooks = await getEbooks();
        if (fetchedEbooks.length === 0) {
          // If no ebooks are in Firestore, use the demo data
          fetchedEbooks = demoEbooks;
        }
        setEbooks(fetchedEbooks);
      } catch (error) {
        console.error("Failed to fetch e-books:", error);
        setEbooks(demoEbooks); // Fallback to demo data on error
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const sortedAndFilteredEbooks = ebooks
    .filter((ebook) => {
      const matchesSubject =
        selectedSubject === 'All' || ebook.subject === selectedSubject;
      const matchesClass =
        selectedClass === 'All' || ebook.class === selectedClass;
      const matchesSearch = ebook.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSubject && matchesClass && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'Popularity') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortOption === 'A-Z') {
        return a.title.localeCompare(b.title);
      }
      // 'Latest uploaded' is default, and data is pre-sorted by date from Firestore
      return 0;
    });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          E-Book Library
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse, view, and download from our collection of e-books.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-6 rounded-lg bg-background/80 py-4 backdrop-blur-sm md:sticky md:top-[70px] md:z-10 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 rounded-full h-12 text-base"
          />
        </div>
        <div className="flex flex-nowrap items-center justify-center gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full sm:w-auto">
               <ListFilter className="h-4 w-4 mr-2" />
               <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {allSubjectsList.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-[180px]">
               <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              {allClassesList.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {sortedAndFilteredEbooks.length > 0 ? (
        <EbookList ebooks={sortedAndFilteredEbooks} />
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-xl">No e-books found.</p>
          <p className="mt-2">Check back soon for new additions!</p>
        </div>
      )}
    </div>
  );
}
