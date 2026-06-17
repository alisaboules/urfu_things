import './MainPage.css';
import { FaCheck, FaUser } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowLeft, MdOutlinePlace } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { SidebarAdmin } from '../Sidebars/SidebarAdmin';
import { SidebarUser } from '../Sidebars/SidebarUser';
import { SidebarPickup } from '../Sidebars/SidebarPickup';
import { TbMessageQuestion } from 'react-icons/tb';
import { useMemo } from 'react';
import type { ApiItem, Item, PickupPointResponse, PickupPointType } from '../App';
import Fuse from 'fuse.js';
import { Searchbar } from '../Searchbar';
import { FaTrashAlt } from 'react-icons/fa';
import {
  claimFoundItem,
  confirmIssuance,
  createHistory,
  createNotification,
  deleteFoundItem,
  deleteLostItem,
  getFoundItemsByPickupPoint,
  getIssuanceHistory,
  getPickupPointItems,
} from '../Api/Api';
import { toast } from 'react-toastify';

type MainPageProps = {
  items: Item[];
  loadMore: (type: 'found' | 'lost') => Promise<void>;
  onItemDeleted?: (id: number, type: 'found' | 'lost') => void;
};

const allPickupPoints = ['ГУК', 'ФТИ', 'ИНМТ', 'ИРИТ-РТФ', 'УГИ'];

function MainPage({ items, loadMore, onItemDeleted }: MainPageProps) {
  const filterRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [type, setType] = useState('lost');
  const [imageIds, setImageIds] = useState<string[]>([]);
  // Для сотрудника: отдельные списки
  const [pickupItems, setPickupItems] = useState<Item[]>([]); // "В пункте"
  const [issuedItems, setIssuedItems] = useState<Item[]>([]); // "Выданы"

  // const fileInputRef = useRef<HTMLInputElement>(null);
  //   const [imageSearchIds, setImageSearchIds] = useState<string[]>([]);
  // const [searchByImageActive, setSearchByImageActive] = useState(false);
  // const resetImageSearch = () => {
  //   setImageSearchIds([]);
  //   setSearchByImageActive(false);
  //   if (fileInputRef.current) fileInputRef.current.value = '';
  // };
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const fullName = user?.first_name || '';

  const [name, surname] = fullName.split(' ');
  const [search, setSearch] = useState('');
  // const [searchResults, setSearchResults] = useState<Item[]>([]);
  const shortName = `${name || ''} ${surname || ''}`.trim();
  // const filteredItems = items.filter((item) => item.type === type);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [locationFilter, setLocationFilter] = useState('');
  const isPickupEmployee = user?.role === 'pickup_point';
  const [dateFilter, setDateFilter] = useState<'new' | 'old' | null>(null);
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
  const baseFiltered = useMemo(() => {
    if (isPickupEmployee) {
      // Для сотрудника: type='lost' -> "В пункте", type='found' -> "Выданы"
      return type === 'lost' ? pickupItems : issuedItems;
    } else {
      // Для студента: обычная фильтрация по типу
      return items.filter((item) => item.type === type);
    }
  }, [isPickupEmployee, type, pickupItems, issuedItems, items]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fuse = useMemo(() => {
    return new Fuse(baseFiltered, {
      keys: ['title', 'description', 'location_ref', 'location_text'],
      threshold: 0.2,
      ignoreLocation: true,
    });
  }, [baseFiltered]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return baseFiltered;

    return fuse.search(search).map((r) => r.item);
  }, [search, fuse, baseFiltered]);

  const displayedItems = useMemo(() => {
    let result = searchResults;

    // 1. категория (если есть поле category)
    if (categoryFilter) {
      result = result.filter((item) => item.title === categoryFilter);
    }

    // 2. место
    if (locationFilter.trim()) {
      result = result.filter(
        (item) =>
          (item.pickup_point_name ?? '').trim().toLowerCase() ===
          locationFilter.trim().toLowerCase(),
      );
    }

    // 3. дата
    if (dateFilter) {
      result = [...result].sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime();
        const db = new Date(b.created_at || 0).getTime();

        return dateFilter === 'new' ? db - da : da - db;
      });
    }

    return result;
  }, [searchResults, categoryFilter, locationFilter, dateFilter]);
  const finalItems = useMemo(() => {
    if (imageIds.length === 0) return displayedItems;

    return displayedItems.filter((item) => imageIds.includes(String(item.id)));
  }, [displayedItems, imageIds]);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const loaderRef = useRef<HTMLDivElement>(null);
  // const [isFilterOpen, setIsFilterOpen] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        console.log('INTERSECTION', entry.isIntersecting);

        if (entry.isIntersecting) {
          await loadMore(type as 'found' | 'lost');
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [type, loadMore]);

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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [pickupOpen, setPickupOpen] = useState(false);

  const categories = useMemo(() => {
    return [...new Set(items.map((item) => item.title))];
  }, [items]);

  const locations = useMemo(() => {
    return [...allPickupPoints];
  }, []);
  // const firstSuggestion = suggestions.find((s) => s.toLowerCase().startsWith(search.toLowerCase()));
  // useEffect(() => {
  //   const loadHistory = async () => {
  //     try {
  //       const data = await getSearchHistory();
  //       setHistory(data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   loadHistory();
  // }, []);

  // useEffect(() => {
  //   const loadSuggestions = async () => {
  //     try {
  //       if (!search.trim()) {
  //         setSuggestions(history.slice(0, 5));
  //         return;
  //       }

  //       const data = await getSearchSuggestions(search);

  //       // console.log("SEARCH:", search);
  //       console.log('SUGGESTIONS:', data);

  //       setSuggestions(data.slice(0, 5));
  //       // console.log("DATA:", data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   loadSuggestions();
  // }, [search, history]);
  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
        setDateOpen(false);
        setPickupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // const saveSearch = async (query: string) => {
  //   try {
  //     await saveSearchQuery(query);

  //     const historyData = await getSearchHistory();
  //     setHistory(historyData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // console.log("showSuggestions =", showSuggestions);
  // console.log("suggestions =", suggestions);
  // console.log('FILTER CLICK:', locationFilter);

  // console.log(
  //   'ALL PICKUP VALUES:',
  //   items.map((i) => i.pickup_point_name),
  // );
  // console.log(displayedItems);
  const [pickupPoints, setPickupPoints] = useState<{ id: number; name: string }[]>([]);
  const [selectedPickupPointId, setSelectedPickupPointId] = useState<number | null>(null);
  useEffect(() => {
    if (isPickupEmployee) {
      getPickupPointItems().then((data) => {
        const points = data.results || data;
        const formatted: PickupPointType[] = points.map((p: PickupPointResponse) => ({
          id: p.id,
          name: p.name,
        }));
        setPickupPoints(formatted);
        // По умолчанию выбираем свой пункт сотрудника
        const myPointId = user?.pickup_point;
        if (myPointId && formatted.some((p) => p.id === myPointId)) {
          setSelectedPickupPointId(myPointId);
        } else if (formatted.length > 0) {
          setSelectedPickupPointId(formatted[0].id);
        }
      });
    }
  }, [isPickupEmployee, user?.pickup_point]);

  const deleteItem = async (id: number, type: 'found' | 'lost') => {
    try {
      if (type === 'found') {
        await deleteFoundItem(id);
      } else {
        await deleteLostItem(id);
      }

      setSelectedItem(null);

      if (onItemDeleted) {
        onItemDeleted(id, type);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error('Не удалось удалить вещь', { className: 'custom-toast-error' });
    }
  };
  const loadPickupData = async (pickupPointId: number) => {
    try {
      const itemsData = await getFoundItemsByPickupPoint(pickupPointId);
      const items = itemsData.results || itemsData;
      const availableItems = items.filter((item: ApiItem) => item.status !== 'issued');
      const mappedPickup = availableItems.map((item: ApiItem) => ({
        id: item.id,
        user: item.user,
        type: 'found' as const,
        title: item.category_name || 'Без категории',
        img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
        description: item.description || "Без описания",
        location_ref: item.location_ref,
        status: item.status,
        author: item.author,
        created_at: item.created_at,
        pickup_point_name: item.pickup_point_name,
        pickup_point: item.pickup_point,
      }));
      setPickupItems(mappedPickup);

      // Загружаем историю выдач (выданные вещи)
      const historyData = await getIssuanceHistory();
      console.log(historyData);
      const issuances = historyData.results || historyData;
      const mappedIssued = issuances.map((iss) => ({
  id: iss.found_item,
  user: iss.user,
  type: "found" as const,
  title: iss.found_item_title,
  img: iss.found_item_image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
  description: iss.found_item_description || "Без описания",
  location_ref: iss.found_item_location,
  status: "issued",
  author: iss.found_item_author,
  created_at: iss.found_item_created_at,
  pickup_point_name: iss.pickup_point_name,
  pickup_point: iss.pickup_point,
}));
      setIssuedItems(mappedIssued);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка загрузки данных ПВЗ', { className: 'custom-toast-error' });
    }
  };

  useEffect(() => {
    if (isPickupEmployee && selectedPickupPointId !== null) {
      (async () => {
        await loadPickupData(selectedPickupPointId);
      })();
    }
  }, [selectedPickupPointId, isPickupEmployee]);

  const handleConfirmIssuance = async (item: Item) => {
    await confirmIssuance(item.id, user.id); 
    await createHistory(item.id, "confirm");
    // await createNotification({
    //   action_type: 'confirm',
    //   item_id: item.id,
    //   item_title: item.title,
    //   item_category: item.title,
    //   item_description: item.description || "Без описания",
    //   creator_name: item.author || 'Не указано',
    //   creator_id: item.user,
    //   pickup_point_name: item.pickup_point_name || item.location_ref || 'Не указан',
    // });;
    toast.success('Выдача подтверждена', { className: 'custom-toast' });
    await loadPickupData(selectedPickupPointId!); 
    // setPickupItems((prev) => prev.filter((i) => i.id !== item.id));
    // const issuedCopy = { ...item, status: 'issued' };
    // setIssuedItems((prev) => [issuedCopy, ...prev]);
    setSelectedItem(null);
  };
  const handleClaim = async (item: Item) => {
    try {
      await claimFoundItem(
        item.id,
      );
      await createHistory(item.id, "claim");
      await createNotification({
      action_type: 'claim',
      item_id: item.id,
      item_title: item.title,
      item_category: item.title,   
      item_description: item.description || "Без описания",
      creator_name: item.author || 'Не указано',
      creator_id: item.user,
      pickup_point_name: item.pickup_point_name || item.location_ref || 'Не указан',
    });
      toast.success('Ваша заявка успешно отправлена', { className: 'custom-toast' });
      setSelectedItem(null);
      onItemDeleted?.(item.id, item.type);
    } catch (err) {
      console.error(err);
      toast.error('Ошибка подачи заявки', { className: 'custom-toast-error' });
    }
  };
  const [pickupDropdownOpen, setPickupDropdownOpen] = useState(false);
   useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
      setPickupDropdownOpen(false); // закрываем только выпадашку, а не весь блок
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  const [selectedPickupPointName, setSelectedPickupPointName] = useState<string | null>(
  user?.pickup_point ?? null
);
  return (
    <>
      <div className="container_header_homepage">
        <div className="header">
          <h1 className="logo-uni" onClick={() => navigate('/')}>
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
              <button onClick={() => setType('lost')}>
                {isPickupEmployee ? 'В пункте' : 'Потеряшки'}
              </button>

              <button onClick={() => setType('found')}>
                {isPickupEmployee ? 'Выданы' : 'Находки'}
              </button>
            </div>
          </div>
          {isPickupEmployee && pickupPoints.length > 0 && (
            <div className="pickup-point-selector">
              <div className="pickup-point-block">
                <div className="filter-block" ref={filterRef}>
                  <button
                    
                    className={`filter ${selectedPickupPointName ? 'filter-active' : ''}`}
                    onClick={() => setPickupDropdownOpen(!pickupDropdownOpen)}>
                    Пункт выдачи
                    <MdKeyboardArrowLeft
                      className={`filter-icon ${pickupDropdownOpen ? 'rotated' : ''}`}
                    />
                  </button>
                  {pickupDropdownOpen && (
                    <div className="filter-popup">
                      {pickupPoints.map((point) => (
                        <button
                          key={point.id}
                          onClick={() => {
                            setSelectedPickupPointId(point.id);
                            setSelectedPickupPointName(point.name);
                            setPickupDropdownOpen(false);
                            loadPickupData(point.id);
                          }}>
                          {point.name}
                          {selectedPickupPointId === point.id && (
                            <FaCheck className="filter-check" />
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedPickupPointId(null);
                          setSelectedPickupPointName('');
                          setPickupDropdownOpen(false);
                        }}>
                        Сбросить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {user?.role != 'pickup_point' && (
            <div className="filters" ref={filtersRef}>
              <div className="filter-block">
                <button
                  className={`filter ${categoryFilter ? 'filter-active' : ''}`}
                  onClick={() => setCategoryOpen(!categoryOpen)}>
                  Категория
                  <MdKeyboardArrowLeft className={`filter-icon ${categoryOpen ? 'rotated' : ''}`} />
                </button>
                {categoryOpen && (
                  <div className="filter-popup">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setCategoryFilter(category);
                          setCategoryOpen(false);
                        }}>
                        {category}
                        {categoryFilter === category && <FaCheck className="filter-check" />}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setCategoryFilter(null);
                        setCategoryOpen(false);
                      }}>
                      Сбросить
                    </button>
                  </div>
                )}
              </div>
              <div className="filter-block" ref={filtersRef}>
                <button
                  className={`filter ${dateFilter ? 'filter-active' : ''}`}
                  onClick={() => setDateOpen(!dateOpen)}>
                  По дате
                  <MdKeyboardArrowLeft className={`filter-icon ${dateOpen ? 'rotated' : ''}`} />
                </button>
                {dateOpen && (
                  <div className="filter-popup">
                    <button
                      onClick={() => {
                        setDateFilter('new');
                        setDateOpen(false);
                      }}>
                      Сначала новые
                      {dateFilter === 'new' && <FaCheck className="filter-check" />}
                    </button>

                    <button
                      onClick={() => {
                        setDateFilter('old');
                        setDateOpen(false);
                      }}>
                      Сначала старые
                      {dateFilter === 'old' && <FaCheck className="filter-check" />}
                    </button>

                    <button
                      onClick={() => {
                        setDateFilter(null);
                        setDateOpen(false);
                      }}>
                      Сбросить
                    </button>
                  </div>
                )}
              </div>
              <div className="filter-block" ref={filtersRef}>
                <button
                  className={`filter ${locationFilter ? 'filter-active' : ''}`}
                  onClick={() => setPickupOpen(!pickupOpen)}>
                  По месту
                  <MdKeyboardArrowLeft className={`filter-icon ${pickupOpen ? 'rotated' : ''}`} />
                </button>
                {pickupOpen && (
                  <div className="filter-popup">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => {
                          setLocationFilter(location);
                          setPickupOpen(false);
                        }}>
                        {location}
                        {locationFilter === location && <FaCheck className="filter-check" />}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setLocationFilter('');
                        setPickupOpen(false);
                      }}>
                      Сбросить
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="grid">
            {finalItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="card"
                onClick={() => setSelectedItem(item)}>
                <div className="card-image-main">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="card-title">
                  <p>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            ref={loaderRef}
            style={{
              opacity: 0,
              // background: '#4811ff',
            }}></div>
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
              {(user?.id === selectedItem.user || user?.role === 'admin') && (
                <FaTrashAlt
                  className="delete-btn"
                  onClick={async () => {
                    await deleteItem(selectedItem.id, selectedItem.type);
                  }}
                />
              )}
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
              <p>Описание: {selectedItem.description || "Без описания"}</p>
              {user?.role != 'student' ? (
                <p className="card-author">
                  Опубликовал/а: <span className="author">{selectedItem.author}</span>
                </p>
              ) : null}
            </div>

            <div className="popup-footer">
              {user?.role === 'student' && selectedItem?.type === 'found' && (
                <button className="responce-btn" onClick={() => handleClaim(selectedItem)}>
                  Это моя вещь
                </button>
              )}
              {user?.role === 'pickup_point' &&
 selectedItem?.pickup_point === user.pickup_point &&
 type === 'lost' && (  
  <button
    className="responce-btn"
    onClick={() => handleConfirmIssuance(selectedItem)}>
    Подтвердить выдачу
  </button>
)}
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
