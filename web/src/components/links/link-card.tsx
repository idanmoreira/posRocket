import type { Link } from "../../services/create-link";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type LinkCardProps = {
  isDeleting: boolean;
  link: Link;
  onDelete: (shortUrl: string) => void;
};

export const LinkCard = ({ isDeleting, link, onDelete }: LinkCardProps) => {
  const shortUrlHref = `/${link.shortUrl}`;

  return (
    <article className="link-card">
      <div className="link-card-copy">
        <a className="link-card-title" href={shortUrlHref}>
          brev.ly/{link.shortUrl}
        </a>
        <p className="link-card-url">{link.originalUrl}</p>
      </div>

      <div className="link-card-meta">
        <span>{link.accessCount} acessos</span>
        <Button
          className="link-card-delete"
          disabled={isDeleting}
          onClick={() => onDelete(link.shortUrl)}
          type="button"
        >
          {isDeleting ? <Spinner aria-label={`Excluindo ${link.shortUrl}`} /> : null}
          <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
        </Button>
      </div>
    </article>
  );
};
