import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateLinkForm, type CreateLinkFormValues } from "../components/links/create-link-form";
import { LinkList } from "../components/links/link-list";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { Toast } from "../components/ui/toast";
import type { Link } from "../services/create-link";
import { createLink } from "../services/create-link";
import { deleteLink } from "../services/delete-link";
import { exportLinks } from "../services/export-links";
import { listLinks } from "../services/list-links";

const linksQueryKey = ["links"];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return "Unexpected error";
};

const triggerCsvDownload = (url: string, filename = "links.csv") => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const HomePage = () => {
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deletingShortUrl, setDeletingShortUrl] = useState<string | null>(null);

  const linksQuery = useQuery({
    queryFn: listLinks,
    queryKey: linksQueryKey,
    placeholderData: [],
  });

  const createLinkMutation = useMutation({
    mutationFn: createLink,
    onError: (error) => {
      setToastMessage(getErrorMessage(error));
    },
    onSuccess: async () => {
      setToastMessage("Link criado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (shortUrl: string) => {
      setDeletingShortUrl(shortUrl);
      return deleteLink(shortUrl);
    },
    onError: (error, _shortUrl, previousLinks) => {
      queryClient.setQueryData(linksQueryKey, previousLinks);
      setToastMessage(getErrorMessage(error));
    },
    onMutate: async (shortUrl) => {
      await queryClient.cancelQueries({ queryKey: linksQueryKey });
      const previousLinks = queryClient.getQueryData<Link[]>(linksQueryKey);

      queryClient.setQueryData<Link[] | undefined>(linksQueryKey, (current) => {
        if (!current) {
          return current;
        }

        return current.filter((link) => link.shortUrl !== shortUrl);
      });

      return previousLinks;
    },
    onSettled: async () => {
      setDeletingShortUrl(null);
      await queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
    onSuccess: () => {
      setToastMessage("Link removido com sucesso.");
    },
  });

  const exportLinksMutation = useMutation({
    mutationFn: exportLinks,
    onError: (error) => {
      setToastMessage(getErrorMessage(error));
    },
    onSuccess: ({ url }) => {
      triggerCsvDownload(url);
      setToastMessage("Exportação iniciada.");
    },
  });

  const orderedLinks = useMemo(() => {
    return [...(linksQuery.data ?? [])].sort((first, second) => {
      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
  }, [linksQuery.data]);

  const handleCreate = async (values: CreateLinkFormValues) => {
    const alreadyExists = orderedLinks.some((link) => link.shortUrl === values.shortUrl);

    if (alreadyExists) {
      setToastMessage("Essa URL encurtada já existe.");
      return;
    }

    await createLinkMutation.mutateAsync(values);
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage("URL copiada.");
    } catch {
      setToastMessage("Não foi possível copiar a URL.");
    }
  };

  const handleDelete = (shortUrl: string) => {
    deleteLinkMutation.mutate(shortUrl);
  };

  const handleExport = () => {
    exportLinksMutation.mutate();
  };

  return (
    <main className="home-page">
      <section className="home-topbar">
        <div>
          <p className="brand-mark">posRocket</p>
          <h1 className="screen-title">Gerencie seus links</h1>
        </div>
        <p className="screen-copy">
          Cadastre, acompanhe acessos e exporte seus atalhos em um só lugar.
        </p>
      </section>

      <section className="home-grid">
        <CreateLinkForm isSubmitting={createLinkMutation.isPending} onSubmit={handleCreate} />

        <section className="panel" aria-labelledby="link-list-title">
          <div className="panel-header panel-header-row">
            <div>
              <p className="eyebrow">Seus links</p>
              <h2 id="link-list-title" className="panel-title">
                Links cadastrados
              </h2>
              <p className="panel-description">
                Acompanhe desempenho, exclua atalhos e exporte um CSV com o histórico.
              </p>
            </div>

            <Button
              disabled={exportLinksMutation.isPending || orderedLinks.length === 0}
              onClick={handleExport}
              type="button"
            >
              {exportLinksMutation.isPending ? <Spinner aria-label="Exportando CSV" /> : null}
              <span>{exportLinksMutation.isPending ? "Exportando..." : "Exportar CSV"}</span>
            </Button>
          </div>

          {linksQuery.isLoading ? (
            <div className="list-loading" role="status">
              <Spinner aria-label="Carregando links" />
              <span>Carregando links...</span>
            </div>
          ) : (
            <LinkList
              deletingShortUrl={deletingShortUrl}
              links={orderedLinks}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          )}
        </section>
      </section>

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </main>
  );
};
