
import { EbookCard } from './EbookCard.jsx';

export function EbookList({ ebooks }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook.id || ebook.publicId} ebook={ebook} />
      ))}
    </div>
  );
}
