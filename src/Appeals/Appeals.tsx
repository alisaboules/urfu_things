import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Appeals.css';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { PiInfoLight } from 'react-icons/pi';
import { SidebarPickup } from '../Sidebars/SidebarPickup/SidebarPickup';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin/SidebarAdmin';
import { getAppeals } from '../Api/Api';

export type Appeal = {
  id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  admin_comment?: string | null;
};

function Appeals() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Appeal[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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
  useEffect(() => {
  const load = async () => {
    try {
      const data = await getAppeals();
      setCards(data.results || data);
      console.log("APPEALS RAW:", data);
    } catch (e) {
      console.error(e);
    }
  };

  load();
}, []);
  // const cards = [
  //   {
  //     id: 1,
  //     title: 'Отказ в выдаче вещи',
  //     date: '09.12.2026',
  //   },
  //   {
  //     id: 2,
  //     title: 'Порча вещи на пункте выдачи',
  //     date: '30.11.2026',
  //   },
  //   {
  //     id: 3,
  //     title: 'Отсутствие верификации',
  //     date: '04.07.2026',
  //   },
  //   {
  //     id: 4,
  //     title: 'Отдайте мои ключи',
  //     date: '01.05.2026',
  //   },
  // ];
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
        <div className="card-appeals">
          <div className="title-appeals">Обращения пользователей</div>
          <hr className='hrs'/>
          <button className="filter-appeals">Фильтры</button>
          <div className="wrapper-appeals">
            <div className="cards-appeals">
              {cards.map((item) => (
                <div className="card-appeals-item" key={item.id}>
                  <div className="content-appeals-item">
                    <h3 className="title-appeals-item">{item.subject}</h3>
                    <p className="date-appeals">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
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

export { Appeals };
