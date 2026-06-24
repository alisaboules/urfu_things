import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Appeals.css';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { PiInfoLight } from 'react-icons/pi';
import { SidebarPickup } from '../Sidebars/SidebarPickup/SidebarPickup';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin/SidebarAdmin';
import { getAppeals } from '../Api/Api';
import type { AppealImage } from '../types';

function Appeals() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<AppealImage[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealImage | null>(null);
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
        console.log('APPEALS RAW:', data);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);
  
  return (
    <>
      <div className="container-appeals">
        <div className="header-appeals">
          <h1 className="logo-uni" onClick={() => navigate('/main')}>
            UniFind
          </h1>
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
          <hr className="hrs" />
          {/* <button className="filter-appeals">Фильтры</button> */}
          <div className="wrapper-appeals">
            <div className="cards-appeals">
              {cards.map((item) => (
                <div
                  className="card-appeals-item"
                  key={item.id}
                  onClick={() => setSelectedAppeal(item)}>
                  <div className="content-appeals-item">
                    <h3 className="title-appeals-item">{item.subject}</h3>
                    <p className="date-appeals">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <PiInfoLight className="infoBtn" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedAppeal && (
          <div className="modal-overlay" onClick={() => setSelectedAppeal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h1>{selectedAppeal.subject}</h1>

              <p>
                <strong>Дата:</strong>{' '}
                <span className="descript-appeals">
                  {new Date(selectedAppeal.created_at).toLocaleDateString()}
                </span>
              </p>

              <p>
                <strong>Статус:</strong>{' '}
                <span className="descript-appeals">{selectedAppeal.status}</span>
              </p>
              <p>
                <strong>Автор:</strong>{' '}
                <span className="descript-appeals">{selectedAppeal.username}</span>
              </p>

              <p>
                <strong>ID карточки:</strong>{' '}
                <span className="descript-appeals">
                  {selectedAppeal.found_item ?? selectedAppeal.lost_item}
                </span>
              </p>
              <p>
                <strong>Сообщение:</strong>
              </p>

              <div className="appeal-message">{selectedAppeal.message}</div>

              {selectedAppeal.admin_comment && (
                <>
                  <p>
                    <span className="descript-appeals">Ответ администратора</span>:
                  </p>

                  <div className="admin-comment">{selectedAppeal.admin_comment}</div>
                </>
              )}

              <button className="close-modal-btn" onClick={() => setSelectedAppeal(null)}>
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { Appeals };
