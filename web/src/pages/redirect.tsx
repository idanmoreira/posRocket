import { useEffect, useState } from "react";
import { useInRouterContext, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../components/ui/spinner";

type RedirectStatus = "error" | "loading";

const RedirectPageLoading = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Redirecionando link">
        <p className="brand-mark">posRocket</p>
        <h1>Redirecionando...</h1>
        <p className="hero-copy">O link será aberto automaticamente em alguns instantes.</p>
        <div className="list-loading" role="status">
          <Spinner aria-label="Redirecionando" />
          <span>Carregando destino...</span>
        </div>
      </section>
    </main>
  );
};

const RedirectPageError = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Erro ao redirecionar link">
        <p className="brand-mark">posRocket</p>
        <h1>Erro ao redirecionar</h1>
        <p className="hero-copy">Não foi possível localizar o destino deste link agora.</p>
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

        try {
          await incrementAccess(shortUrl);
        } catch (incrementError) {
          console.warn("Falha ao incrementar contador de acesso", incrementError);
        }

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

        console.error("Falha ao redirecionar shortUrl", { shortUrl, error });
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
