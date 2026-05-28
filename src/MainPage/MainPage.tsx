import './MainPage.css';
import { IoIosSearch } from 'react-icons/io';
import { FaUser } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdOutlinePlace } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { SidebarPickup } from '../Sidebars/SidebarPickup';
import { TbMessageQuestion } from 'react-icons/tb';
import type { Item } from '../App';

type MainPageProps = {
  items: Item[];
};

function MainPage({ items }: MainPageProps) {
  const navigate = useNavigate();
  const [type, setType] = useState('found');
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const fullName = user?.first_name || '';

  const [name, surname] = fullName.split(' ');

  const shortName = `${name || ''} ${surname || ''}`.trim();
  const filteredItems = items.filter((item) => item.type === type);
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

  const isPickupEmployee = user?.role === 'pickup_point';

  return (
    <>
      <div className="container_header_homepage">
        <div className="header">
          <h1 onClick={() => navigate('/')}>UniFind</h1>
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
              <button onClick={() => setType('lost')}>
                {isPickupEmployee ? 'В пункте' : 'Потерянные'}
              </button>

              <button onClick={() => setType('found')}>
                {isPickupEmployee ? 'Выданы' : 'Найденные'}
              </button>
            </div>
          </div>
          <button className="filter">Фильтры</button>

          <div className="grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="card" onClick={() => setSelectedItem(item)}>
                <div className="card-image-main">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="card-title">
                  <p>{item.title}</p>
                </div>
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
          {user?.role === 'student' && (
            <>
              <SidebarUser userName={shortName} onClose={() => setSidebarOpen(false)} />
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <SidebarAdmin
                userName={shortName}
                role={'Администратор'}
                onClose={() => setSidebarOpen(false)}
              />
            </>
          )}
          {user?.role === 'pickup_point' && (
            <>
              <SidebarPickup
                userName={shortName}
                role={'Сотрудник пункта выдачи'}
                onClose={() => setSidebarOpen(false)}
              />
            </>
          )}
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
              <TbMessageQuestion
                className="appeal-btn"
                onClick={() => {
                  navigate('/appeal', { state: { itemId: selectedItem.id, type: type } });
                }}
              />
            </div>

            <div className="discription-for-card">
              <h2>{selectedItem.title}</h2>
              <div className="location">
                <MdOutlinePlace className="location-icon" />
                <p>{selectedItem.location_ref}</p>
              </div>
              {/* <p>{selectedItem.status}</p> */}
              <p>{selectedItem.description}</p>
              {user?.role != 'student' ? <p className="card-author">Опубликовал/а: <span className='author'>{selectedItem.author}</span></p> : null}
            </div>
            <div className="popup-footer">
              <button className="responce-btn" onClick={() => setSelectedItem(null)}>
                {user?.role != 'student' ? 'Подтвердить выдачу' : 'Это моя вещь'}
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
