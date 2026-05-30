import React, { useEffect, useState } from "react";
import authService from "../../services/authService";
import { useAuth } from "../../context/authContext";
import Spinner from "../../components/common/Spinner.jsx";
import { User, Mail } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, login } = useAuth();

  // PROFILE STATE
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await authService.getProfile();
      const data = res?.data;

      setFormData({
        username: data?.username || "",
        email: data?.email || "",
      });
    } catch (error) {
      console.log("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const res = await authService.updateProfile(formData);

      toast.success("Profile updated successfully");

      login(res?.data, localStorage.getItem("token"));
    } catch (error) {
      toast.error(error?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen max-w-xl">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account details
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white/5 border border-emerald-500/10 rounded-xl p-6 backdrop-blur-lg space-y-5">

        {/* AVATAR */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-bold">
            {formData.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        {/* USERNAME */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Username
          </label>
          <div className="flex items-center bg-slate-800 rounded-lg px-3 border border-slate-700">
            <User size={16} className="text-slate-400 mr-2" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent py-2 outline-none text-white"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Email
          </label>
          <div className="flex items-center bg-slate-800 rounded-lg px-3 border border-slate-700">
            <Mail size={16} className="text-slate-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent py-2 outline-none text-white"
            />
          </div>
        </div>

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600 transition py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </div>

    </div>
  );
};

export default ProfilePage;