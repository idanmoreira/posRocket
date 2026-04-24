import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routerConfig } from "../router";

describe("Router", () => {
  it("renders not found for invalid routes", () => {
    const router = createMemoryRouter(routerConfig, {
      initialEntries: ["/rota-invalida"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/não encontrado/i)).toBeInTheDocument();
  });
});
