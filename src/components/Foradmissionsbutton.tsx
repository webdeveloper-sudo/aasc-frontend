import React from "react";
import { useNavigate } from "react-router-dom";

const Foradmissionsbutton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");

    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };
  return (
    <div className="flex items-center justify-center">
        <div className="">
      <button onClick={handleClick} className="red-btn py-2">
        For Admissions
      </button>
    </div>
    </div>
  );
};

export default Foradmissionsbutton;
