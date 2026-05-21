import { Outlet } from "react-router";
import { Header } from "../components/Header";

export function Root() {
  return (
    <div className="app-canvas min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="relative z-10 min-h-screen pb-28 md:pb-0 md:pl-[104px] lg:pl-[120px]">
        <Outlet />
      </main>
    </div>
  );
}
