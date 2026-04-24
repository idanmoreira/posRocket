import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { NotFoundPage } from "../pages/not-found";

describe("NotFoundPage", () => {
  it("renders a way back to the home page", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/não encontrado/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar para a home/i })).toHaveAttribute("href", "/");
  });
});
