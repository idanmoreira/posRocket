import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { TextInput } from "./components/ui/text-input";
import { Toast } from "./components/ui/toast";

export const App = () => {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-label="App shell preview">
        <p className="eyebrow">Brev.ly</p>
        <h1>Encurtador de URL</h1>
        <p className="hero-copy">
          Base inicial da interface com tema global e componentes compartilhados.
        </p>

        <div className="preview-grid">
          <TextInput aria-label="URL original" placeholder="https://example.com" />
          <Button type="button">Encurtar</Button>
        </div>

        <div className="preview-row" aria-label="UI primitives preview">
          <Spinner aria-label="Carregando" />
          <Toast message="Primitivos prontos para uso." />
        </div>
      </section>
    </main>
  );
};
