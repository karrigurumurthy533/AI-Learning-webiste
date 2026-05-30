import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/authContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-900 to-slate-800 text-white">

      {/* Sidebar ✅ FIXED */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header toggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;