import type { MouseEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Link } from "../../services/create-link";
import { env } from "../../env";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type LinkCardProps = {
  isDeleting: boolean;
  link: Link;
  onCopy: (url: string) => void;
  onDelete: (shortUrl: string) => void;
};

const linksQueryKey = ["links"];

export const LinkCard = ({ isDeleting, link, onCopy, onDelete }: LinkCardProps) => {
  const queryClient = useQueryClient();
  const shortUrlHref = `/${link.shortUrl}`;
  const shortUrl = new URL(shortUrlHref, env.VITE_FRONTEND_URL).toString();
  const shortUrlLabel = shortUrl.replace(/^https?:\/\//, "");

  const handleShortUrlClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    queryClient.setQueryData<Link[] | undefined>(linksQueryKey, (current) => {
      if (!current) {
        return current;
      }

      return current.map((item) =>
        item.shortUrl === link.shortUrl
          ? { ...item, accessCount: item.accessCount + 1 }
          : item,
      );
    });
  };

  return (
    <article className="link-card">
      <div className="link-card-copy">
        <a
          className="link-card-title"
          href={shortUrlHref}
          onClick={handleShortUrlClick}
          rel="noopener noreferrer"
          target="_blank"
        >
          {shortUrlLabel}
        </a>
        <p className="link-card-url">{link.originalUrl}</p>
      </div>

      <div className="link-card-meta">
        <span>{link.accessCount} acessos</span>
        <div className="link-card-actions">
          <Button
            className="link-card-action"
            disabled={isDeleting}
            onClick={() => onCopy(shortUrl)}
            type="button"
          >
            Copiar
          </Button>
          <Button
            className="link-card-action"
            disabled={isDeleting}
            onClick={() => onDelete(link.shortUrl)}
            type="button"
          >
            {isDeleting ? <Spinner aria-label={`Excluindo ${link.shortUrl}`} /> : null}
            <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
