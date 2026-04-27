import './MainPage.css';
import { IoIosSearch } from 'react-icons/io';
import { FaUser } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar';
import { MdOutlinePlace } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
// import type { ItemResponse } from '../Api/Api';

type Item = {
  id: number;
  title: string;
  img: string;
  description: string;
  location: string;
  status: string;
};

type ApiItem = {
  id: number;
  user: number;
  category: number | null;
  pickup_point: number | null;
  location_type: string;
  location_ref: string;
  description: string;
  status: string;
  image: string | null;
  created_at: string;
};


const fallbackItems: Item[] = [
  {
    id: 1,
    title: 'Кошелёк',
    img: `${import.meta.env.BASE_URL}images/кошелёк.jpg`,
    description: 'Черный кожаный кошелёк.',
    location: 'Аудитория 301, возле окна',
    status: 'Не найден',
  },
  {
    id: 2,
    title: 'Ключи',
    img: `${import.meta.env.BASE_URL}images/ключи.jpg`,
    description: 'Связка ключей с металлическим брелком.',
    location: 'Вход в корпус',
    status: 'Найден',
  },
  {
    id: 3,
    title: 'Наушники AirPods',
    img: `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
    description: 'Белые AirPods в кейсе.',
    location: 'Библиотека, на столе',
    status: 'Не найден',
  },
  {
    id: 4,
    title: 'Зарядка от ноутбука',
    img: `${import.meta.env.BASE_URL}images/подзарядка.jpg`,
    description: 'Зарядное устройство для ноутбука HP.',
    location: 'УрФУ, ГУК',
    status: 'Найден',
  },
  {
    id: 5,
    title: 'Канцелярия',
    img: `${import.meta.env.BASE_URL}images/канцелярия.jpg`,
    description: 'Набор канцелярии в пенале.',
    location: 'Учебный корпус, коридор',
    status: 'Не найден',
  },
  {
    id: 6,
    title: 'Одежда',
    img: `${import.meta.env.BASE_URL}images/чёрная шапка.jpg`,
    description: 'Чёрная шапка.',
    location: 'Гардероб',
    status: 'Найден',
  },
];

function MainPage() {
  const [items, setItems] = useState<Item[]>( []);
  const navigate = useNavigate();
  const [type, setType] = useState('found');
  // const [refresh, setRefresh] = useState(0);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
 

  useEffect(() => {
    const fetchItems = async () => {
      console.log('API URL:', import.meta.env.VITE_API_URL);

      const url =
        type === 'lost'
          ? `${import.meta.env.VITE_API_URL}/lost/`
          : `${import.meta.env.VITE_API_URL}/found/`;
      console.log('FULL URL:', url);
      try {
        const res = await fetch(url);
        const data = await res.json();

        console.log('API RAW RESPONSE:', data);

        const list: ApiItem[] = Array.isArray(data)
  ? data
  : Array.isArray(data.results)
    ? data.results
    : data
      ? [data]
      : [];
        // setItems(fallbackItems);
        if (list.length > 0) {
        setItems(
          list.map(
            (item): Item => ({
              id: item.id,
              title: item.description || 'Без названия',
             img: item.image || '/images/аэрподс.jpg',
              description: item.description,
              location: item.location_ref,
              status: item.status,
            }),
          ),
        );}
        else {
          setItems(fallbackItems);
        }
        
      } catch (e) {
        console.error(e);
        // setItems(fallbackItems); // только при ОШИБКЕ
      }
    };

    fetchItems();
  }, [type ]);

  // const location = useLocation();

  // useEffect(() => {
  //   if (location.state?.refresh) {
  //     setRefresh((prev) => prev + 1);
  //   }
  // }, [location.state]);

  const closeAllPopups = () => {
    setIsImageOpen(false);
    setSelectedItem(null);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
      <div className="container_header_homepage">
        <div className="header">
          <h1>UniFind</h1>
          <FaUser className="profile-icon" onClick={() => setSidebarOpen(true)} />
        </div>

        <div className="search">
          <IoIosSearch className="icon-search" />
          <input type="text" placeholder="Поиск" />
        </div>
      </div>
      <div className="container_main_homepage">
        <div className="phon">
          <div className="tabs">
            <div className={`tabs ${type}`}>
              <button onClick={() => setType('lost')}>Потерянные</button>

              <button onClick={() => setType('found')}>Найденные</button>
            </div>
          </div>
          <button className="filter">Фильтры</button>

          <div className="grid">
            {items.map((item) => (
              <div key={item.id} className="card" onClick={() => setSelectedItem(item)}>
                <div className="card-image-main">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="card-title"><p>{item.title}</p></div>
              </div>
            ))}
          </div>
        </div>
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
      {selectedItem && !isImageOpen && (
        <div className="popup-overlay" onClick={() => setSelectedItem(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-image-wrapper">
              <img src={selectedItem.img} alt={selectedItem.title} />

              <button className="popup-close">
                <RxCross1 className="cross-icon" onClick={() => setSelectedItem(null)} />
              </button>

              <button
                className="popup-fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageOpen(true);
                }}>
                <BsArrowsFullscreen className="fullscreen-icon" />
              </button>
            </div>

            <div className="discription-for-card">
              <h2>{selectedItem.title}</h2>
              <div className="location">
                <MdOutlinePlace className="location-icon" />
                <p>{selectedItem.location}</p>
              </div>
              <p>{selectedItem.status}</p>
              <p>{selectedItem.description}</p>
            </div>
            <div className="popup-footer">
              <button className="responce-btn" onClick={() => setSelectedItem(null)}>
                Откликнуться
              </button>
            </div>
          </div>
        </div>
      )}

      <button className={`fab ${sidebarOpen ? 'fab-open' : ''}`} onClick={() => navigate('/ad')}>
        <FaPlus />
      </button>
      {isImageOpen && selectedItem && (
        <div className="image-viewer" onClick={() => closeAllPopups()}>
          <img
            src={selectedItem.img}
            alt={selectedItem.title}
            className="image-viewer-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export { MainPage };
