import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainLayout } from "./04-layouts/MainLayout";
import { Home } from "./05-Pages/Home";
import { SearchPage } from "./05-Pages/Search";
import { Login } from "./05-Pages/01-Login";
import { Register } from "./05-Pages/02-Register";
import { VerifyRegisterEmail } from "./05-Pages/03-verifyRegisterEmail";

// Import and configure "react-toastify" in your app:
// ✅ Import react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Forgotpassword } from "./05-Pages/04-forgot-password";
import { VerifyForgotPasswordOTP } from "./05-Pages/05-verifyForgotPasswordOTP";
import { ResetPassword } from "./05-Pages/06-reset-Password";
import { SessionProvider } from "./03-features/auth/SessionProvider";

import { ProtectedRoute } from "./04-layouts/ProtectRouts/ProtectedRoute";
import { Dashboard } from "./05-Pages/ProtectedPages/dashBoardPage";
import { ProductListpage } from "./05-Pages/07-ProductListPage";
import { SingleProductPage } from "./05-Pages/08-SingleProductDetail";
import { Checkout } from "./05-Pages/09-checkout";
import OrderSuccess from "./05-Pages/10-success";

// Move this OUTSIDE the App component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 60 * 60 * 1000, // 60 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false, // ← This prevents multiple calls
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

/*
1. If you create QueryClient inside your <App /> component, React will create a new client every time App renders.
2. That means React Query will think it's a fresh app, so it clears the cache and makes API calls again.
3. To avoid this, you create QueryClient outside the component.
4. To avoid this, you create QueryClient outside the component.



1. React Query’s QueryClient manages the "query cache"(Stores results of your API calls (GET requests)) and "mutation cache"(Keeps track of "write" operations (POST, PUT, DELETE). Example: You submit a form → React Query temporarily saves this action in the mutation cache.  It handles: 1.Retrying failed requests    2.Optimistic updates (showing data before the server confirms)   3.Rollbacks if something fails).
2. If QueryClient is instantiated inside a component function, it will be re-created on every render.
  . This resets its internal state (queryCache, mutationCache, observers, etc.).
  . Result: queries re-mount, cache is discarded, and unnecessary network requests are triggered.
3. Placing QueryClient outside ensures a singleton-like instance is created once at module evaluation time, preserving:
    . Active observers
    . Query/mutation cache
    . StaleTime, retry states, etc.


*/

export default function App() {
  // create router object
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/search", element: <SearchPage /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/verify-email", element: <VerifyRegisterEmail /> },
        { path: "/forgot-password", element: <Forgotpassword /> },
        { path: "/verify-otp", element: <VerifyForgotPasswordOTP /> },
        { path: "/reset-Password", element: <ResetPassword /> },
        {path:"/checkout",element:<Checkout/>},
         {path:"/success",element:<OrderSuccess/>},
        {path:"/prn/:productName/prid/:productId",element:<SingleProductPage/>},
        {path:"/products/:category/:subcategory", element:<ProductListpage/>}
      ],
    },







    // Shared routes accessible by all routes
{
  element: <ProtectedRoute allowedRoles={["admin", "user"]} />,
  children: [
    { path: "/account/profile", element: <Dashboard /> },
  ],
},


    // Protected section
    // Admin protected routes
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [{ path: "/account/admin/*", element: <Dashboard /> }],
  },

  // Non-admin protected routes
  {
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [{ path: "/account/*", element: <Dashboard /> }],
  },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* ✅ Place ToastContainer here so it's globally available */}
        <ToastContainer position="top-right" autoClose={3000} />
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}     

/*
How to trigger a toast in any component:
import { toast } from "react-toastify";

function handleSuccess() {
  toast.success("Operation completed successfully!");
}

function handleError() {
  toast.error("An error occurred!");
}



✅ Step 3 – Replace alert() with toast.success() or toast.error():






*/
