import React, { useContext } from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import Routers from "../routes/Routers";
// import Sidebar from "../components/layout/AdminDashboard/Global/Sidebar";
import { AuthContext } from "../context/AuthContext";

export const Layout = () => {
  const { role } = useContext(AuthContext);

  return (
    <>
      {role !== "admin" && <Header />}
      {/* {role === "admin" && <Sidebar />} */}
      <main className={role === "admin" ? "" : "pt-20 md:pt-24"}>
        <Routers />
      </main>
      {role !== "admin" && <Footer />}
    </>
  );
};

export default Layout;