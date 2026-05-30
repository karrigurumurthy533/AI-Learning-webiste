import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Layers,
  User,
  LogOut,
  X,
  BrainCircuit,
  Menu,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Flashcards", icon: Layers, path: "/flashcards" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  const handleClick = (item) => {
    navigate(item.path);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute top-3 left-3 z-50 p-2 rounded-md bg-white/10 text-white hover:bg-white/20"
        >
          <Menu size={22} />
        </button>
      )}

      {/* OVERLAY (MOBILE) */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-auto
        bg-white/5 border-r border-emerald-500/10 backdrop-blur-lg flex flex-col
        transition-all duration-300 overflow-y-auto
        ${
          isMobile
            ? open
              ? "w-64 h-screen translate-x-0"
              : "w-0 -translate-x-full"
            : open
            ? "w-64"
            : "w-20"
        }`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between">
          {/* LOGO */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 text-white"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <BrainCircuit size={20} className="text-white" />
            </div>

            {open && !isMobile && (
              <span className="font-bold text-lg">AI Learning</span>
            )}
          </button>

          {/* CLOSE BUTTON */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-md hover:bg-white/10 transition text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item, index) => {
            // ✅ FIXED ACTIVE LOGIC
            const isActive = location.pathname.startsWith(item.path);

            return (
              <button
                key={index}
                onClick={() => handleClick(item)}
                className={`flex items-center gap-3 rounded-lg transition-all
                  ${
                    open
                      ? "w-full p-2 justify-start"
                      : "w-12 h-12 justify-center mx-auto"
                  }
                  ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/40"
                      : "hover:bg-white/10 text-slate-300"
                  }`}
              >
                <item.icon size={18} />
                {open && <span>{item.name}</span>}
              </button>
            );
          })}

          {/* LOGOUT */}
          <button
            onClick={() => navigate("/login")}
            className={`flex items-center gap-3 rounded-lg mt-4 transition-all
              ${
                open
                  ? "w-full p-2 justify-start"
                  : "w-12 h-12 justify-center mx-auto"
              }
              hover:bg-white/10 text-slate-300`}
          >
            <LogOut size={18} />
            {open && "Logout"}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;