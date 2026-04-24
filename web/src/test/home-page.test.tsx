import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/list-links", () => ({
  listLinks: vi.fn().mockResolvedValue([]),
}));

vi.mock("../services/create-link", () => ({
  createLink: vi.fn(),
}));

vi.mock("../services/delete-link", () => ({
  deleteLink: vi.fn(),
}));

vi.mock("../services/export-links", () => ({
  exportLinks: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
        status: 200,
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders the app shell", async () => {
    const { App } = await import("../app");
    render(<App />);
    expect(screen.getByText(/encurtador/i)).toBeInTheDocument();
  });

  it("shows the create form and the empty state", async () => {
    const { App } = await import("../app");
    render(<App />);

    expect(screen.getByLabelText(/url original/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url encurtada/i)).toBeInTheDocument();
    expect(screen.getByText(/nenhum link cadastrado/i)).toBeInTheDocument();
  });
});
