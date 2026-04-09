import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense } from "react";

import Layout from "@/components/layout/Layout";
import RequireAuth from "@/components/layout/RequireAuth";
import Sidebar from "./elements/SideBar";
import Navbar from "./elements/Navbars";
import { useAuthStore } from "./pages/login/store";
import { publicRoutes, privateRoutes, catchAllRoute } from "@/routes/index";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAUpdateNotification from "./components/PWAUpdateNotification";

function App() {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  return (
    <>
      <PWAInstallPrompt />
      <PWAUpdateNotification />
    <Suspense
      // fallback={
      //   <section className="font-roboto layout">
      //     {accessToken && (
      //       <Sidebar />
      //     )}

      //     <div className="layout-container">
      //       {accessToken && ( 
      //         <Navbar showNotificationsMenu={false} />
      //       )}
      //       <div className="flex justify-center items-center h-screen w-full">
      //         <span className="loader"></span>
      //       </div>
      //     </div>
      //   </section>
      // }
      fallback={
          <section className="font-roboto layout">
            <div className="flex justify-center items-center h-screen w-full">
              <span className="loader"></span>
            </div>
          </section>
        }
    >
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            {privateRoutes.map(({ path, element, index }) => (
              <Route key={path} path={path} element={element} index={index} />
            ))}
          </Route>
        </Route>

        {/* Catch-All Route */}
        <Route path={catchAllRoute.path} element={catchAllRoute.element} />
      </Routes>
    </Suspense>
   </>
  );
}

export default App;
