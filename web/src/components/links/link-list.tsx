import type { Link } from "../../services/create-link";
import { EmptyState } from "./empty-state";
import { LinkCard } from "./link-card";

type LinkListProps = {
  deletingShortUrl: string | null;
  links: Link[];
  onCopy: (url: string) => void;
  onDelete: (shortUrl: string) => void;
};

export const LinkList = ({ deletingShortUrl, links, onCopy, onDelete }: LinkListProps) => {
  if (links.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="link-list" aria-label="Links cadastrados">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          isDeleting={deletingShortUrl === link.shortUrl}
          link={link}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
