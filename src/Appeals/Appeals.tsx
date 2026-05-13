import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Appeals.css";
import { Sidebar } from "../Sidebar";
import { PiInfoLight } from "react-icons/pi";

function Appeals() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
   const cards = [
  {
    id: 1,
    title: "Отказ в выдаче вещи",
    date: "09.12.2026",
  },
  {
    id: 2,
    title: "Порча вещи на пункте выдачи",
    date: "30.11.2026",
  },
  {
    id: 3,
    title: "Отсутствие верификации",
    date: "04.07.2026",
  },
  {
    id: 4,
    title: "Отдайте мои ключи",
    date: "01.05.2026",
  },
];
  return (
    <>
      <div className="container-appeals">
        <div className="header-appeals">
          <h1 onClick={() => navigate('/main')}>UniFind</h1>
          <FaUser className="profile-appeals-icon" onClick={() => setSidebarOpen(true)} />
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
        <div className="card-appeals">
          <div className="title-appeals">Обращения пользователей</div>
          <button className="filter-appeals">Фильтры</button>
            <div className="wrapper-appeals">
              <div className="cards-appeals">
                {cards.map((item) => (
                  <div className="card-appeals-item" key={item.id}>
                    <div className="content-appeals-item">
                      <h3 className="title-appeals-item">{item.title}</h3>
                      <p className="date-appeals">{item.date}</p>
                    </div>
                    <PiInfoLight className="infoBtn" />
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

export {Appeals};