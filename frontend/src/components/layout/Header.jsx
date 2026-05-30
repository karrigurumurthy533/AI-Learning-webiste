import React from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/authContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-lg text-white">
      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 ml-auto">

        {/* Notification */}
        <button className="p-2 hover:bg-white/10 rounded-lg transition relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/20"></div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
          {user?.username?.charAt(0)?.toUpperCase() || "G"}
        </div>

        {/* User Info */}
        <div className="leading-tight">
          <p className="text-sm font-medium">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-slate-400">
            {user?.email || "user@example.com"}
          </p>
        </div>

      </div>
    </header>
  );
};

export default Header;