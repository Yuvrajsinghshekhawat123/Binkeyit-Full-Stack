import { Outlet } from "react-router-dom";
import { NavBar } from "../02-Components/header/NavBar";
import { Footer } from "../02-Components/footer/footer";
export function MainLayout() {
  return (
    <>
      <section className="min-h-screen bg-white">
        <NavBar />

        <main className="min-h-[80vh] ">
          <Outlet />
        </main>

        <Footer />
      </section>
    </>
  );
}
