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
// import type { ApiItem, Item } from '../App';
// import { searchItems } from '../Api/Api';
import { useMemo } from 'react';

import type { Item } from '../App';
import Fuse from 'fuse.js';
import { getSearchHistory, getSearchSuggestions, saveSearchQuery } from '../Api/Api';

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
  const [search, setSearch] = useState('');
  // const [searchResults, setSearchResults] = useState<Item[]>([]);
  const shortName = `${name || ''} ${surname || ''}`.trim();
  const filteredItems = items.filter((item) => item.type === type);
//   const suggestions = useMemo(() => {
//   if (!search.trim()) return [];

//   return filteredItems
//     .filter(
//       (item) =>
//         item.title.toLowerCase().includes(search.toLowerCase()) ||
//         item.location_ref.toLowerCase().includes(search.toLowerCase())
//     )
//     .slice(0, 5);
// }, [search, filteredItems]);

  const closeAllPopups = () => {
    setIsImageOpen(false);
    setSelectedItem(null);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPickupEmployee = user?.role === 'pickup_point';
  const fuse = useMemo(() => {
    return new Fuse(filteredItems, {
      keys: ['title', 'description', 'location_ref', 'location_text'],
      threshold: 0.2,
      ignoreLocation: true,
    });
  }, [filteredItems]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return filteredItems;

    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, filteredItems]);
  
  const displayedItems = searchResults;
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);



  // useEffect(() => {
  //   const timeout = setTimeout(async () => {
  //     try {
  //       if (!search.trim()) {
  //         setSearchResults([]);
  //         return;
  //       }

  //       const data = await searchItems(search, type as 'found' | 'lost');
  //       console.log('SEARCH RAW:', data);
  //       //   const results = (data.results || data).map((item: ApiItem) => ({
  //       //   ...item,
  //       //   img: item.image || '',
  //       // }));
  //       const results = (data.results || data).map((item: ApiItem) => ({
  //         id: item.id,
  //         user: item.user,
  //         type: type as 'found' | 'lost',
  //         title: item.category_name || 'Без названия',
  //         img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
  //         description: item.description,
  //         location_ref: item.location_ref,
  //         status: item.status,
  //         author: item.author,
  //       }));
  //       setSearchResults(results);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeout);
  // }, [search, type]);
  
  const [history, setHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const firstSuggestion = suggestions.find((s) =>
  s.toLowerCase().startsWith(search.toLowerCase())
);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        if (!search.trim()) {
          setSuggestions(history);
          return;
        }

        const data = await getSearchSuggestions(search);

      console.log("SEARCH:", search);
      console.log("SUGGESTIONS:", data);

        setSuggestions(data);
        console.log("DATA:", data);
     
      } catch (err) {
        console.error(err);
      }
    };

    loadSuggestions();
  }, [search, history]);

 const saveSearch = async (query: string) => {
  try {
    await saveSearchQuery(query);

    const historyData = await getSearchHistory();
    setHistory(historyData);
  } catch (err) {
    console.error(err);
  }
};
console.log("showSuggestions =", showSuggestions);
console.log("suggestions =", suggestions);
 
  return (
    <>
      <div className="container_header_homepage">
        <div className="header">
          <h1 onClick={() => navigate('/')}>UniFind</h1>
          <FaUser className="profile-icon" onClick={() => setSidebarOpen(true)} />
        </div>

        <div className="search">
          <IoIosSearch className="icon-search" />

          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                saveSearch(search);
                setShowSuggestions(false);
              }
            }}
          />
          {firstSuggestion && search && (
            <div className="ghost">
              {search}
              <span className="ghost-rest">{firstSuggestion.slice(search.length)}</span>
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="search-suggestion"
                  onClick={() => {
                    setSearch(suggestion);
                    saveSearch(suggestion);
                    setShowSuggestions(false);
                  }}>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
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
            {displayedItems.map((item) => (
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
              {selectedItem.created_at && (
                <p className="date">
                  Дата создания:{' '}
                  {new Date(selectedItem.created_at).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              <p>Описание: {selectedItem.description}</p>
              {user?.role != 'student' ? (
                <p className="card-author">
                  Опубликовал/а: <span className="author">{selectedItem.author}</span>
                </p>
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

export { MainPage };
