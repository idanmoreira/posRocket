export const EmptyState = () => {
  return (
    <section className="empty-state" aria-live="polite">
      <p className="empty-state-badge">Sua lista ainda está vazia</p>
      <h2 className="panel-title">Nenhum link cadastrado</h2>
      <p className="hero-copy">
        Adicione seu primeiro link para começar a acompanhar cliques e gerar relatórios.
      </p>
    </section>
  );
};
