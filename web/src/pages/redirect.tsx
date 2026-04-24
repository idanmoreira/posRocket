import { useEffect, useState } from "react";
import { useInRouterContext, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";

type RedirectStatus = "error" | "loading";

const RedirectPageLoading = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Redirecionando link">
        <p className="eyebrow">Brev.ly</p>
        <h1>Abrindo destino</h1>
        <div className="list-loading" role="status">
          <Spinner aria-label="Redirecionando" />
          <span>Redirecionando...</span>
        </div>
      </section>
    </main>
  );
};

const RedirectPageError = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Erro ao redirecionar link">
        <p className="eyebrow">Brev.ly</p>
        <h1>Erro ao redirecionar</h1>
        <p className="hero-copy">Nao foi possivel localizar o destino do link agora.</p>
        <a className="ui-button" href="/">
          Voltar para a home
        </a>
      </section>
    </main>
  );
};

const RedirectPageWithRouter = () => {
  const navigate = useNavigate();
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [status, setStatus] = useState<RedirectStatus>("loading");

  useEffect(() => {
    let isActive = true;

    const resolveShortUrl = async () => {
      if (!shortUrl) {
        navigate("/not-found", { replace: true });
        return;
      }

      try {
        const [{ getLink }, { incrementAccess }] = await Promise.all([
          import("../services/get-link"),
          import("../services/increment-access"),
        ]);
        const link = await getLink(shortUrl);
        await incrementAccess(shortUrl);

        if (!isActive) {
          return;
        }

        window.location.replace(link.originalUrl);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error &&
          error.statusCode === 404
        ) {
          navigate("/not-found", { replace: true });
          return;
        }

        setStatus("error");
      }
    };

    void resolveShortUrl();

    return () => {
      isActive = false;
    };
  }, [navigate, shortUrl]);

  if (status === "error") {
    return <RedirectPageError />;
  }

  return <RedirectPageLoading />;
};

export const RedirectPage = () => {
  const isInRouterContext = useInRouterContext();

  if (!isInRouterContext) {
    return <RedirectPageLoading />;
  }

  return <RedirectPageWithRouter />;
};
