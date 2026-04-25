export const NotFoundPage = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="Página não encontrada">
        <p className="brand-mark">posRocket</p>
        <h1>Link não encontrado</h1>
        <p className="hero-copy">
          O endereço informado não existe ou foi removido. Verifique a URL e tente novamente.
        </p>
        <a className="ui-button" href="/">
          Voltar para a home
        </a>
      </section>
    </main>
  );
};
