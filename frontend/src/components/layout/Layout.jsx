// import { Outlet } from "react-router-dom";
// import Navbar from "@/elements/Navbars";

// import Sidebar from "@/elements/SideBar";
// import Footer from "./Footer";
// import { Toaster } from "../ui/toaster";
// import { cn } from "@/lib/utils";
// import { useHomeStore } from "@/pages/home/store";

// const Layout = () => {
//   const { isCollapsed } = useHomeStore();
//   return (
//     <section
//       className={cn(" font-roboto layout ", isCollapsed ? "pl-24" : "pl-0")}
//     >
//       <Sidebar />

//       <div className="layout-container">
//         <Navbar showNotificationsMenu={true}/>
//         <Outlet />
//         {/* <Footer /> */}
//       </div>
//       <Toaster />
//     </section>
//   );
// };

// export default Layout;

import { Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";

import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useHomeStore } from "@/pages/home/store";
import AppSidebar from "./app-sidebar";

const Layout = () => {
  const {isCollapsed} = useHomeStore()
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-mobile": "20rem",

        "--sidebar-keyboard-shortcut": "b",
      }}
      className={cn( isCollapsed ? "pl-[10px]" : "pl-0")}

    >
      <AppSidebar />
      <main className={cn(" font-roboto layout")}>
        <Navbar />
        <div className="layout-container px-4 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
