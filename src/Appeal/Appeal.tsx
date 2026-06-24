import { FaUser } from 'react-icons/fa6';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Appeal.css';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { SidebarPickup } from '../Sidebars/SidebarPickup/SidebarPickup';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin/SidebarAdmin';
import { createAppeal } from '../Api/Api';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { AppealPayload } from '../App';

function Appeal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();
  const { itemId, type } = location.state || {};
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
  const handleSubmit = async () => {
    try {
      const payload: AppealPayload = {
        subject,
        message,
      };

      if (type === 'found') {
        payload.found_item = itemId;
      }

      if (type === 'lost') {
        payload.lost_item = itemId;
      }

      await createAppeal(payload);

      toast.success('Обращение успешно отправлено.', { className: 'custom-toast' });

      navigate('/main');
    } catch (error) {
      console.error(error);

      toast.error('Ошибка отправки обращения. Попробуйте снова.', {
        className: 'custom-toast-error',
      });
    }
  };

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
        <div className="card-appeal">
          <div className="title-appeal">Обращение в администрацию</div>

          <div className="textarea-appeal">
            <label>Тема обращения</label>
            <textarea
              placeholder="Введите тему обращения"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <hr className="hr-appeal" />
          <div className="textarea-appeal oi">
            <textarea
              placeholder="Введите текст обращения"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="actions-appeal">
            <button className="submit-appeal" onClick={() => handleSubmit()}>
              Отправить
            </button>
            <button className="cancel-appeal" onClick={() => navigate('/main')}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { Appeal };
