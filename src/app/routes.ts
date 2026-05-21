import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Browse } from "./pages/Browse";
import { MovieDetail } from "./pages/MovieDetail";
import { Search } from "./pages/Search";
import { MyList } from "./pages/MyList";
import { Movies } from "./pages/Movies";
import { Series } from "./pages/Series";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "browse", Component: Browse },
      { path: "movies", Component: Movies },
      { path: "series", Component: Series },
      { path: "movie/:id", Component: MovieDetail },
      { path: "search", Component: Search },
      { path: "my-list", Component: MyList },
      { path: "profile", Component: Profile },
    ],
  },
]);
