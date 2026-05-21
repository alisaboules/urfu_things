import { uploadAvatar } from "../Api/Api.ts";
import { FaPlus } from "react-icons/fa";
import "./Profile.css";
import { IoReturnUpBack } from "react-icons/io5";
import { MdAddAPhoto } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useState, useRef  } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const updatedUser = await uploadAvatar(file);

      setUser(updatedUser);

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const shortName = (user?.first_name || '')
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .join(' ');

  const navigate = useNavigate();

  return (
    <div className="main-profile-icon">
      <div className="container-return-icon">
        <IoReturnUpBack className="return-icon" onClick={() => navigate(-1)} />
      </div>

      <div
        className="avatar-circle"
        onClick={() => {
          if (!user?.avatar) {
            inputRef.current?.click();
          }
        }}>
        {user?.avatar ? <img src={user.avatar} alt="avatar" /> : <FaPlus className="plus-icon" />}
      </div>
      <p className="main-profile-name">{shortName}</p>
      <div className="sign-icons">
        <MdAddAPhoto className="change-photo-icon" onClick={() => inputRef.current?.click()} />
        <MdEdit className="edit-photo-icon" onClick={() => inputRef.current?.click()} />
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