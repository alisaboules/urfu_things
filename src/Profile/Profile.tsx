import { uploadAvatar, updateProfile } from '../Api/Api.ts';
import './Profile.css';
import { IoReturnUpBack } from 'react-icons/io5';
import { MdAddAPhoto } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import { FaCheck, FaPlus, FaSun } from 'react-icons/fa';
import { useTheme } from '../ThemeContext.tsx';

function Profile() {
  const { theme, toggleTheme: globalToggleTheme } = useTheme();
  const handleToggleTheme = () => {
    globalToggleTheme();
  };
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const toggleNotifications = async () => {
    const newValue = !enabled;
    setEnabled(newValue);

    try {
      const updatedUser = await updateProfile({
        notifications_enabled: newValue,
      });

      setUser(updatedUser);

      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      setEnabled(!newValue);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const updatedUser = await uploadAvatar(file);

      setUser(updatedUser);

      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
    }
  };
  const shortName = (user?.first_name || '').trim().split(/\s+/).slice(0, 2).join(' ');
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  useLayoutEffect(() => {
    setEnabled(user?.notifications_enabled ?? false);
  }, [user]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    email: user?.email || '',
    student_id: user?.student_id || '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile(formData);

      setUser(updatedUser);

      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-profile-icon">
      <div className="container-return-icon">
        <IoReturnUpBack className="return-icon" onClick={() => navigate(-1)} />
      </div>

      <div
        className={`avatar-circle ${user?.avatar ? 'has-avatar' : ''}`}
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
        {isEditing ? (
          <FaCheck className="edit-photo-icon" onClick={handleSave} />
        ) : (
          <MdEdit className="edit-photo-icon" onClick={() => setIsEditing(true)} />
        )}
      </div>
      <div className="main-user-info">
        {isEditing ? (
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="profile-input"
          />
        ) : (
          <p className={`user-info-label1 ${isEditing ? 'editable-field' : ''}`}>
            {user?.first_name}
          </p>
        )}
        <p className="user-info-label2">Имя пользователя</p>
        <p className="user-info-label1">{user?.email}</p>
        <p className="user-info-label2">Почта</p>
        {/* ADMIN */}
        {user?.role === 'admin' && (
          <>
            <p className="user-info-label1">№ {user?.id}</p>
            <p className="user-info-label2">Номер администратора</p>
          </>
        )}

        {/* STUDENT */}
        {user?.role === 'student' && (
          <>
            {isEditing ? (
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <p className="user-info-label1">№ {user?.student_id}</p>
            )}

            <p className="user-info-label2">Номер студенческого</p>
          </>
        )}

        {/* PICKUP POINT EMPLOYEE */}
        {user?.role === 'pickup_point' && (
          <>
            <p className="user-info-label1">{user?.pickup_point_name}</p>
            <p className="user-info-label2">Пункт выдачи</p>
          </>
        )}
      </div>
      <div>
        <div className="notifications-container">
          {enabled ? (
            <IoMdNotifications className="notifications-icon" />
          ) : (
            <IoMdNotificationsOff className="no-notifications-icon" />
          )}
          <p>Уведомления</p>
          <div className={`switch ${enabled ? 'active' : ''}`} onClick={toggleNotifications}>
            <div className="switch-circle"></div>
          </div>
        </div>
      </div>
      <div>
        <div className="notifications-container">
          <p>Тема</p>
          <div
            className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
            onClick={handleToggleTheme}>
            {theme === 'light' ? (
              <FaSun className={`theme-icon`} />
            ) : (
              <FaSun className={`theme-icon rotate`} />
            )}
          </div>
        </div>
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
