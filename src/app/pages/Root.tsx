import { Outlet } from "react-router";
import { Header } from "../components/Header";

export function Root() {
  return (
    <div className="app-canvas min-h-screen overflow-x-hidden bg-background">
      <Header />
      <Outlet />
    </div>
  );
}
