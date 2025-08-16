import { PdfCard } from './PdfCard.jsx';

export function PdfList({ pdfs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {pdfs.map((pdf) => (
        <PdfCard key={pdf.id || pdf.publicId} pdf={pdf} />
      ))}
    </div>
  );
}
