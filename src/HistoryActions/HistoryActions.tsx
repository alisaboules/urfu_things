// import { FaUser } from 'react-icons/fa6';
// import { PiInfoLight } from 'react-icons/pi';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../Magazine/Magazine.css';
// import { SidebarUser } from '../Sidebars/SidebarUser';
// import { MdOutlinePlace } from 'react-icons/md';
// import { SidebarPickup } from '../Sidebars/SidebarPickup/SidebarPickup';
// import { SidebarAdmin } from '../Sidebars/SidebarAdmin/SidebarAdmin';
// import { getNotifications } from '../Api/Api';
// import type { Notificationing } from '../App';

// function HistoryActions() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const user = JSON.parse(localStorage.getItem('user') || 'null');
//   const navigate = useNavigate();
//   const [userName] = useState(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       const savedName = localStorage.getItem('user_name');
//       if (savedName) {
//         return savedName;
//       }
//     }
//     return 'Гость';
//   });
//   const [notifications, setNotifications] = useState<Notificationing[]>([]);

//   const fetchNotifications = async () => {
//     try {
//       const data = await getNotifications();
//       console.log('Ответ от API:', data);
//       setNotifications(data.results);
//     } catch (error) {
//       console.error('Ошибка загрузки уведомлений', error);
//     }
//   };

//   useEffect(() => {
//   const loadNotifications = async () => {
//     try {
//       const data = await getNotifications();
//       setNotifications(data.results);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   loadNotifications();
// }, []);

//   useEffect(() => {
//   const handleVisibilityChange = () => {
//     if (document.visibilityState === 'visible') {
//       fetchNotifications();
//     }
//   };
//   document.addEventListener('visibilitychange', handleVisibilityChange);
//   return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
// }, []);
//   return (
//     <>
//       <div className="container-magazine">
//         <div className="header-magazine">
//           <h1 className="logo-uni" onClick={() => navigate('/main')}>
//             UniFind
//           </h1>
//           <FaUser className="profile-magazine-icon" onClick={() => setSidebarOpen(true)} />
//         </div>
//        <div
//         className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
//         onClick={() => setSidebarOpen(false)}>
//         <div
//           className={`sidebar ${sidebarOpen ? 'open' : ''}`}
//           onClick={(e) => e.stopPropagation()}>
//           {user?.role === 'student' && (
//             <>
//               <SidebarUser userName={userName} onClose={() => setSidebarOpen(false)} />
//             </>
//           )}
//           {user?.role === 'admin' && (
//             <>
//               <SidebarAdmin
//                 userName={userName}
//                 role={'Администратор'}
//                 onClose={() => setSidebarOpen(false)}
//               />
//             </>
//           )}
//           {user?.role === 'pickup_point' && (
//             <>
//               <SidebarPickup
//                 userName={userName}
//                 role={'Сотрудник пункта выдачи'}
//                 onClose={() => setSidebarOpen(false)}
//               />
//             </>
//           )}
//         </div>
//       </div>
//         <div className="card-magazine">
//           <div className="title-magazine">История действий</div>
//           <hr className='hrs'/>
//           {/* <button className="filter-magazine">Фильтры</button> */}
//           <div className="wrapper-magazine">
//             <div className="notifications">
//               {notifications.map((item) => (
//                 <div className="notification-card" key={item.id}>
//                   <div className="notification-content">
//                     <div className="notification-header">
//                       <span className="notification-title">{item.item_title}</span>

//                       {item.pickup_point_name && (
//                         <span className="notification-place">
//                           <MdOutlinePlace /> {item.pickup_point_name}
//                         </span>
//                       )}
//                     </div>

//                     {item.item_description && <div className="notification-subtitle">{item.item_description}</div>}
//                   </div>
//                   <PiInfoLight className="notification-info-icon" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export { HistoryActions };
import { FaUser } from 'react-icons/fa6';
import { PiInfoLight } from 'react-icons/pi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Magazine/Magazine.css';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { MdOutlinePlace } from 'react-icons/md';
import { SidebarPickup } from '../Sidebars/SidebarPickup/SidebarPickup';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin/SidebarAdmin';
import { getNotifications } from '../Api/Api';
import type { Notificationing } from '../types';

// Временные данные
interface FakeNotification {
  id: number;
  item_title: string;
  pickup_point_name: string;
  item_description: string;
}
const fakeNotifications: FakeNotification[] = [
  {
    id: 1,
    item_title: 'Наушники AirPods Pro',
    pickup_point_name: 'ГУК',
    item_description: 'Найдены в аудитории 123, белые, в чехле.',
  },
  {
    id: 2,
    item_title: 'Банковская карта Сбербанк',
    pickup_point_name: 'ФТИ',
    item_description: 'Найдена на первом этаже, возле турникетов.',
  },
  {
    id: 3,
    item_title: 'Ключи от квартиры',
    pickup_point_name: 'ИНМТ',
    item_description: 'Найдены в столовой, связка из 3 ключей и брелок.',
  },
  {
    id: 4,
    item_title: 'Портмоне кожаное',
    pickup_point_name: 'ИРИТ-РТФ',
    item_description: 'Тёмно-коричневое, внутри студенческий билет.',
  },
  {
    id: 5,
    item_title: 'Зарядное устройство iPhone',
    pickup_point_name: 'УГИ',
    item_description: 'Белый блок с кабелем, найдено в 205 кабинете.',
  },
];

function HistoryActions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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
  const [notifications, setNotifications] = useState<Notificationing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.results || []);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Обновление при возвращении на вкладку
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const displayData =
    notifications.length > 0 ? notifications : fakeNotifications;

  return (
    <>
      <div className="container-magazine">
        <div className="header-magazine">
          <h1 className="logo-uni" onClick={() => navigate('/main')}>
            UniFind
          </h1>
          <FaUser className="profile-magazine-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}>
          <div
            className={`sidebar ${sidebarOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}>
            {user?.role === 'student' && (
              <SidebarUser userName={userName} onClose={() => setSidebarOpen(false)} />
            )}
            {user?.role === 'admin' && (
              <SidebarAdmin
                userName={userName}
                role={'Администратор'}
                onClose={() => setSidebarOpen(false)}
              />
            )}
            {user?.role === 'pickup_point' && (
              <SidebarPickup
                userName={userName}
                role={'Сотрудник пункта выдачи'}
                onClose={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </div>
        <div className="card-magazine">
          <div className="title-magazine">История действий</div>
          <hr className="hrs" />
          <div className="wrapper-magazine">
            <div className="notifications">
              {loading ? (
                // Скелетоны загрузки (опционально)
                <div className="loading-placeholder">Загрузка...</div>
              ) : displayData.length === 0 ? (
                <div className="empty-state">У вас пока нет уведомлений</div>
              ) : (
                displayData.map((item) => (
                  <div className="notification-card" key={item.id}>
                    <div className="notification-content">
                      <div className="notification-header">
                        <span className="notification-title">{item.item_title}</span>
                        {item.pickup_point_name && (
                          <span className="notification-place">
                            <MdOutlinePlace /> {item.pickup_point_name}
                          </span>
                        )}
                      </div>
                      {item.item_description && (
                        <div className="notification-subtitle">{item.item_description}</div>
                      )}
                    </div>
                    <PiInfoLight className="notification-info-icon" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { HistoryActions };