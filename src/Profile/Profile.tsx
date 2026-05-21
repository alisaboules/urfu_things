import React, { useRef } from "react";
import { uploadAvatar } from "../Api/Api.ts";
import { FaPlus } from "react-icons/fa";
import "./Profile.css";
import { IoReturnUpBack } from "react-icons/io5";

function Profile() {
   const user = JSON.parse(localStorage.getItem("user") || "null");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const updatedUser = await uploadAvatar(file);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-profile-icon">
      <div className="profile-icon">
        <IoReturnUpBack className="return-icon" />
      </div>
      <div className="avatar-circle" onClick={() => inputRef.current?.click()}>
        {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <FaPlus className="plus-icon" />}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </div>
  );
}

export { Profile };