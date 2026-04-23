import { FaUser } from 'react-icons/fa6';
import './Advertisement.css';
import { useState } from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

function Advertisement() {
  const [type, setType] = useState("found");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
   const [userName ] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const savedName = localStorage.getItem("user_name");
      if (savedName) {
        return savedName;
      }
    }
    return "Гость";
  });

  return (
    <>
      <div
        className={`sidebar-overlay-2 ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`sidebar-2 ${sidebarOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar userName={userName} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>


      <div className="container-advertisement">
        <div className="header-advertisement">
          <h1>UniFind</h1>
          <FaUser className="profile-advertisement-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <div className="card-advertisement">
          <div className="tabs-advertisement">
            <button
              className={type === "found" ? "tab-advertisement active" : "tab-advertisement"}
              onClick={() => setType("found")}
            >
              Находка
            </button>
            <button
              className={type === "lost" ? "tab-advertisement active" : "tab-advertisement"}
              onClick={() => setType("lost")}
            >
              Пропажа
            </button>
          </div>

          <div className="input-advertisement">
            <span>Категория</span>
            <MdKeyboardArrowLeft className="arrow-advertisement"/>
          </div>

          <div className="textarea-advertisement">
            <label>Описание</label>
            <textarea />
          </div>

          <div className="photo-advertisement">
            <span>Фото</span>
            <button className="add-advertisement-btn">
              <LuCircleFadingPlus className='add-plus-icon'/>
            </button>
          </div>

          <div className="textarea-advertisement">
            <label>Место</label>
            <textarea />
          </div>

          <div className="actions-advertisement">
            <button className="submit-advertisement" onClick={() => navigate(-1)}>Готово</button>
            <button className="cancel-advertisement" onClick={() => navigate(-1)}>Отмена</button>
          </div>
        </div>
    </div>
    </>
  );
};

export { Advertisement };