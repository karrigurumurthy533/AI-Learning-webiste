import React from "react";

const Spinner = ({ size = 24 }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Spinner;