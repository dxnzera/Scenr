import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { MovieDetail } from "./pages/MovieDetail";
import { Search } from "./pages/Search";
import { MyList } from "./pages/MyList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "browse", Component: Browse },
      { path: "movie/:id", Component: MovieDetail },
      { path: "search", Component: Search },
      { path: "my-list", Component: MyList },
    ],
  },
]);
