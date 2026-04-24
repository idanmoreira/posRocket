export const NotFoundPage = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Página não encontrada">
        <p className="eyebrow">Brev.ly</p>
        <h1>Não encontrado</h1>
        <p className="hero-copy">A rota solicitada não existe ou o link informado não foi encontrado.</p>
        <a className="ui-button" href="/">
          Voltar para a home
        </a>
      </section>
    </main>
  );
};
