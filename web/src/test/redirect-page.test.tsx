import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RedirectPage } from "../pages/redirect";

describe("RedirectPage", () => {
  it("shows a loading state while resolving the short url", () => {
    render(<RedirectPage />);
    expect(screen.getByText(/redirecionando/i)).toBeInTheDocument();
  });
});
