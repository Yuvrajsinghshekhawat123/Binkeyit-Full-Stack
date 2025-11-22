 import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Footer } from "../../02-Components/footer/footer";
import { NavBar } from "../../02-Components/header/NavBar";

export function ProtectedRoute({ allowedRoles = [], redirectPath = "/" }) {



  const { userId, role } = useSelector((state) => state.userDetail || {});
  

  // Not logged in → redirect to login
  if (!userId) return <Navigate to={redirectPath} replace />;

  // Logged in but route not allowed → redirect to default dashboard
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    const defaultPath = role === "admin" ? "/account/admin" : "/account";
    return <Navigate to={defaultPath} replace />;
  }





  /*
  Q when a normal user tries to access an admin-only route.
  Evaluate conditions:

    allowedRoles.length → ["admin"].length = 1 → true ✅

    !allowedRoles.includes(role) → !["admin"].includes("user") → !false → true ✅

    Both conditions are true, so this block executes.
  
  
  */

  // Allowed → render route
  return (
    <>
      <NavBar />
      <main className="min-h-[80vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
