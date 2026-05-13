import { FaUser } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Appeal.css";
import { Sidebar } from "../Sidebar";

function Appeal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [userName] = useState(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const savedName = localStorage.getItem('user_name');
      if (savedName) {
        return savedName;
      }
    }
    return 'Гость';
  });
  return (
    <>
      <div className="container-appeal">
        <div className="header-appeal">
          <h1 onClick={() => navigate("/main")}>UniFind</h1>
          <FaUser className="profile-appeal-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}>
        <div
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}>
          <Sidebar userName={userName} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
        <div className="card-appeal">
          <div className="title-appeal">
            Обращение в администрацию
          </div>
        
          <div className="textarea-appeal">
            <label>Тема обращения</label>
            <textarea placeholder="Введите тему обращения"></textarea>
          </div>
          <hr className="hr-appeal" />
          <div className="textarea-appeal oi">
            <textarea placeholder="Введите текст обращения"></textarea>
          </div>
          <div className="actions-appeal">
            <button className="submit-appeal" onClick={() => navigate("/main")}>
              Отправить
            </button>
            <button className="cancel-appeal" onClick={() => navigate("/main")}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { Appeal };