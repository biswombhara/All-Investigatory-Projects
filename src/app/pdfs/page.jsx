'use client';

import { useState, useEffect } from 'react';
import { PdfList } from '../../components/PdfList.jsx';
import { Input } from '../../components/ui/input.jsx';
import { getPdfs } from '../../services/firestore.js';
import { Search } from 'lucide-react';
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


export default function PdfsPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialSubject = searchParams.get('subject') || 'All';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState('All');

  useEffect(() => {
    const fetchPdfs = async () => {
      setLoading(true);
      try {
        const fetchedPdfs = await getPdfs();
        setPdfs(fetchedPdfs);
      } catch (error) {
        console.error("Failed to fetch PDFs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesSubject =
      selectedSubject === 'All' || pdf.subject === selectedSubject;
    const matchesClass =
      selectedClass === 'All' || pdf.class === selectedClass;
    const matchesSearch = pdf.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSubject && matchesClass && matchesSearch;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Document Library
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse, view, and download from our extensive collection of
          educational materials.
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
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full">
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
            <SelectTrigger className="w-full sm:w-[180px] rounded-full">
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
      
      {filteredPdfs.length > 0 ? (
        <PdfList pdfs={filteredPdfs} />
      ) : (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-xl">No documents found.</p>
          <p className="mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
