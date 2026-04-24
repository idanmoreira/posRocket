import type { RouteObject } from "react-router-dom";
import { App } from "./app";

const HomePage = () => <App />;

const RedirectPage = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Página não encontrada">
        <p className="eyebrow">Brev.ly</p>
        <h1>Não encontrado</h1>
        <p className="hero-copy">A página de redirecionamento será conectada na próxima etapa.</p>
      </section>
    </main>
  );
};

const NotFoundPage = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Página não encontrada">
        <p className="eyebrow">Brev.ly</p>
        <h1>Não encontrado</h1>
        <p className="hero-copy">A rota solicitada não existe.</p>
      </section>
    </main>
  );
};

export const routerConfig: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/:shortUrl",
    element: <RedirectPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
