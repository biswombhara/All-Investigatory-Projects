import { PdfCard } from './PdfCard.jsx';

export function PdfList({ pdfs }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pdfs.map((pdf) => (
        <PdfCard key={pdf.id || pdf.publicId} pdf={pdf} />
      ))}
    </div>
  );
}
