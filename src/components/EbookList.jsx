
import { EbookCard } from './EbookCard.jsx';

export function EbookList({ ebooks }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook.id || ebook.publicId} ebook={ebook} />
      ))}
    </div>
  );
}
