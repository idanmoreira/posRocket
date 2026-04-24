import type { RouteObject } from "react-router-dom";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/not-found";
import { RedirectPage } from "./pages/redirect";

export const routerConfig: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/not-found",
    element: <NotFoundPage />,
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
