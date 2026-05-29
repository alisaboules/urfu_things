import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { SidebarUser } from "../Sidebars/SidebarUser";
import { SidebarAdmin } from "../Sidebars/SidebarAdmin";
import { SidebarPickup } from "../Sidebars/SidebarPickup";
import './Statistic.css';
import type { Item } from "../App";
import type { AppealImage } from "../Appeals/Appeals";

type MyStatisticProps = {
  items: Item[];
  appeals: AppealImage[];
};

function MyStatistic({ items, appeals }: MyStatisticProps) {
  const lostCount = items.filter((item) => item.type === 'lost').length;
  const foundCount = items.filter((item) => item.type === 'found').length;
  const appealsCount = appeals.length;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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
          <h1 onClick={() => navigate('/main')}>UniFind</h1>
          <FaUser className="profile-appeal-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}>
          <div
            className={`sidebar ${sidebarOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}>
            {user?.role === 'student' && (
              <>
                <SidebarUser userName={userName} onClose={() => setSidebarOpen(false)} />
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <SidebarAdmin
                  userName={userName}
                  role={'Администратор'}
                  onClose={() => setSidebarOpen(false)}
                />
              </>
            )}
            {user?.role === 'pickup_point' && (
              <>
                <SidebarPickup
                  userName={userName}
                  role={'Сотрудник пункта выдачи'}
                  onClose={() => setSidebarOpen(false)}
                />
              </>
            )}
          </div>
        </div>
        <div className="card-statistic">
          <div className="title-statistic">Статистика</div>
          <div className="statistic-wrapper">
            <p className="statistic-text">Количество потерянных вещей: <span className="statistic-number">{lostCount}</span></p>
            <p className="statistic-text">Количество найденных вещей: <span className="statistic-number">{foundCount}</span></p>
            <p className="statistic-text">Обращений в администрацию: <span className="statistic-number">{appealsCount}</span></p>
          </div>
        </div>
      </div>
    </>
  );
}

export { MyStatistic };