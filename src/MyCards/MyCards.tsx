import '../MainPage/MainPage.css';
import { FaPlus, FaUser } from 'react-icons/fa6';
import { SidebarPickup } from '../Sidebars/SidebarPickup';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin';
import { RxCross1 } from 'react-icons/rx';
import { TbMessageQuestion } from 'react-icons/tb';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { MdOutlinePlace } from 'react-icons/md';
import type { IssuanceHistoryItem, Item } from '../App';
import './MyCards.css';
import { Searchbar } from '../Searchbar';
import Fuse from 'fuse.js';
import { getIssuanceHistory } from '../Api/Api';

// type Item = {
//   id: number;
//   title: string;
//   img: string;
//   description: string;
//   location_ref: string;
//   status: string;
//   user: number;
//   type: 'found' | 'lost';
//   author: string;
// };

type MyCardsProps = {
  items: Item[];
};

function MyCards({ items }: MyCardsProps) {
  const [search, setSearch] = useState('');
  const [imageIds, setImageIds] = useState<string[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();
  const [type, setType] = useState<'found' | 'lost'>('found');
  const [issuedItems, setIssuedItems] = useState<Item[]>([]);
  const myItems =
  type === 'lost'
    ? items.filter((item) => item.user === user?.id)
    : issuedItems;
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const fullName = user?.first_name || '';

  const [name, surname] = fullName.split(' ');

  const shortName = `${name || ''} ${surname || ''}`.trim();

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
  useEffect(() => {
  const loadIssuedItems = async () => {
    try {
      const data = await getIssuanceHistory();
      const issuances = data.results || data;

      const myIssued = issuances
        .filter((iss: IssuanceHistoryItem) => iss.user === user?.id)
        .map((iss: IssuanceHistoryItem) => ({
          id: iss.found_item,
          user: iss.user,
          type: 'found' as const,
          title: iss.found_item_title,
          img: iss.found_item_image ?? '',
          description: iss.found_item_description ?? '',
          location_ref: iss.found_item_location ??  '',
          status: 'issued',
          author: iss.found_item_author,
          created_at: iss.found_item_created_at,
        }));

      setIssuedItems(myIssued);
    } catch (error) {
      console.error(error);
    }
  };

  if (user?.role === 'student') {
    loadIssuedItems();
  }
}, [user?.id, user?.role]);
  // const isPickupEmployee = user?.role === 'pickup_point';
  const fuse = useMemo(() => {
    return new Fuse(myItems, {
      keys: ['title', 'description', 'location_ref'],
      threshold: 0.2,
      ignoreLocation: true,
    });
  }, [myItems]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return myItems;

    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, myItems]);

  const finalItems = useMemo(() => {
    if (imageIds.length === 0) return searchResults;

    return searchResults.filter((item) => imageIds.includes(String(item.id)));
  }, [searchResults, imageIds]);

  return (
    <>
      <div className="container_header_homepage">
        <div className="header">
          <h1 className="logo-uni" onClick={() => navigate('/main')}>
            UniFind
          </h1>
          <FaUser className="profile-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <Searchbar search={search} setSearch={setSearch} onImageSearch={setImageIds} />
      </div>
      <div className="container_main_homepage">
        <div className="phon">
          <div className="tabs">
            <div className={`tabs ${type}`}>
              <button onClick={() => setType('lost')}>Опубликованные</button>

              <button onClick={() => setType('found')}>Забранные</button>
            </div>
          </div>
          {/* <button className="filter">Фильтры</button> */}
          <div className="block"></div>
          {finalItems.length > 0 ? (
            <div className="grid">
              {finalItems.map((item) => (
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
          ) : (
            <div className="no-items-wrapper">
              <p className="no-items">У вас пока нет объявлений</p>
            </div>
          )}
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
              <p>{selectedItem.status}</p>
              <p>{selectedItem.description}</p>
              {user?.role != 'student' ? (
                <p className="card-author">Опубликовал: {selectedItem.author}</p>
              ) : null}
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

export { MyCards };
