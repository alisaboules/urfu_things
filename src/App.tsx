import { Login } from './LoginScreen';
import './App.css';
import { Routes, Route, HashRouter, Outlet } from 'react-router-dom';
import { Registration } from './RegistrationScreen';
import { MainPage } from './MainPage';
import { Advertisement } from './Advertisement';
import './index.css';
import { Appeal } from './Appeal';
import { Appeals } from './Appeals';

import { Magazine } from './Magazine';
import { Profile } from './Profile/Profile';
import { MyCards } from './MyCards/MyCards';
import { useLayoutEffect, useState } from 'react';
import { getAppeals, getItems, getItemsPage } from './Api/Api';
import { MyStatistic } from './Statistic/Statistic';
import type { AppealImage } from './Appeals/Appeals';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './ThemeContext';
import { HistoryActions } from './HistoryActions/historyActions';

export type Item = {
  id: number;
  title: string;
  img: string;
  description: string;
  location_ref: string | undefined;
  status: string;
  user: number;
  type: 'found' | 'lost';
  author?: string;
  created_at?: string;
  pickup_point_name?: string;
  pickup_point?: number | null;

};

export type ApiItem = {
  id: number;
  user: number;
  category: number | null;
  category_name?: string;
  pickup_point: number | null;
  pickup_point_name?: string;
  location_type: string;
  location_ref: string;
  description: string;
  status: string;
  image: string | null;
  created_at: string;
  author?: string;
};

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IssuanceHistoryItem {
  id: number;
  found_item: number;

  found_item_title: string;
  found_item_description?: string;
  found_item_image?: string | null;
  found_item_location?: string;
  found_item_author?: string;
  found_item_created_at?: string;

  pickup_point: number;
  pickup_point_name: string;

  user: number;
}

export interface PickupPointType {
  id: number;
  name: string;
}

export interface PickupPointResponse {
  id: number;
  name: string;
  building: number;
  building_name: string;
  location?: string;
}

export interface NotificationPayload {
  action_type: 'claim' | 'confirm';
  item_id: number;
  item_title: string;
  item_category: string;
  item_description: string;
  creator_name: string;
  creator_id: number;
  pickup_point_name: string;
}

export interface Notificationing extends NotificationPayload {
  id: number;
  action_time: string;
  is_read: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type NotificationsResponse = PaginatedResponse<Notificationing>;

const fallbackItems: Item[] = [
  {
    id: 1,
    title: 'Кошелёк',
    img: `${import.meta.env.BASE_URL}images/кошелёк.jpg`,
    description: 'Черный кожаный кошелёк.',
    location_ref: 'Аудитория 301, возле окна',
    status: 'Не найден',
    user: 1,
    type: 'lost',
  },
  {
    id: 2,
    title: 'Ключи',
    img: `${import.meta.env.BASE_URL}images/ключи.jpg`,
    description: 'Связка ключей с металлическим брелком.',
    location_ref: 'Вход в корпус',
    status: 'Найден',
    user: 2,
    type: 'found',
    author: 'Сидоров Сидор',
  },
  {
    id: 3,
    title: 'Наушники AirPods',
    img: `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
    description: 'Белые AirPods в кейсе.',
    location_ref: 'Библиотека, на столе',
    status: 'Не найден',
    user: 1,
    type: 'lost',
    author: 'Иванов Иван',
  },
  {
    id: 4,
    title: 'Зарядка от ноутбука',
    img: `${import.meta.env.BASE_URL}images/подзарядка.jpg`,
    description: 'Зарядное устройство для ноутбука HP.',
    location_ref: 'УрФУ, ГУК',
    status: 'Найден',
    user: 3,
    type: 'found',
    author: 'Сидоров Сидор',
  },
  {
    id: 5,
    title: 'Канцелярия',
    img: `${import.meta.env.BASE_URL}images/канцелярия.jpg`,
    description: 'Набор канцелярии в пенале.',
    location_ref: 'Учебный корпус, коридор',
    status: 'Не найден',
    user: 2,
    type: 'lost',
    author: 'Петров Петр',
  },
  {
    id: 6,
    title: 'Одежда',
    img: `${import.meta.env.BASE_URL}images/чёрная шапка.jpg`,
    description: 'Чёрная шапка.',
    location_ref: 'Гардероб',
    status: 'Найден',
    user: 1,
    type: 'found',
    author: 'Иванов Иван',
  },
];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [nextFound, setNextFound] = useState<string | null>(null);
  const [nextLost, setNextLost] = useState<string | null>(null);
  const addItem = (item: Item) => {
  setItems(prev => [item, ...prev]);
};
  const [appeals, setAppeals] = useState<AppealImage[]>([]);
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const foundData = await getItems('found');
        const lostData = await getItems('lost');
        console.log('FOUND DATA:', foundData);
        setNextFound(foundData.next);
        setNextLost(lostData.next);
        const found = Array.isArray(foundData) ? foundData : foundData.results || [];

        const lost = Array.isArray(lostData) ? lostData : lostData.results || [];

        const allItems: Item[] = [
          ...found.map((item) => ({
            id: item.id,
            user: item.user,
            type: 'found' as const,
            title: item.category_name?.trim() || 'Без категории',
            img: item.image?.trim() || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
            description: item.description,
            location_ref: item.location_ref || 'Без локации',
            pickup_point_name: item.pickup_point_name || 'Без пункта выдачи',
            pickup_point: item.pickup_point ?? null,
            status: item.status,
            author: item.author,
            created_at: item.created_at,
          })),

          ...lost.map((item) => ({
            id: item.id,
            user: item.user,
            type: 'lost' as const,
            title: item.category_name?.trim() || 'Без категории',
            img: item.image?.trim() || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
            description: item.description,
            location_ref: item.location_ref || item.location_text || 'Без локации',
            pickup_point_name: item.pickup_point_name || 'Без пункта выдачи',
            status: item.status,
            author: item.author,
            created_at: item.created_at,
          })),
        ];

        setItems(allItems);
      } catch (e) {
        console.error(e);
        setItems(fallbackItems);
      }

      try {
        const appealsData = await getAppeals();

        setAppeals(Array.isArray(appealsData) ? appealsData : appealsData.results || []);
      } catch (e) {
        console.error('APPEALS ERROR:', e);
        setAppeals([]);
      }
    };

    fetchData();
  }, []);

  const loadMore = async (type: 'found' | 'lost') => {
    const nextUrl = type === 'found' ? nextFound : nextLost;
    if (!nextUrl) return;

    const data = await getItemsPage(nextUrl);

    const newItems: Item[] = data.results.map((item: ApiItem) => ({
      id: item.id,
      user: item.user,
      type,
      title: item.category_name?.trim() || 'Без категории',
      img: item.image?.trim() || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
      description: item.description,
      location_ref: item.location_ref || 'Без локации',
      pickup_point_name: item.pickup_point_name || 'Без пункта выдачи',
      status: item.status,
      author: item.author,
      created_at: item.created_at,
    }));

    if (type === 'found') {
      setItems((prev) => {
        const existing = new Set(prev.map((i) => i.id));

        const filtered = newItems.filter((i) => !existing.has(i.id));

        return [...prev, ...filtered];
      });
      setNextFound(data.next);
    } else {
      setItems((prev) => {
        const existing = new Set(prev.map((i) => i.id));

        const filtered = newItems.filter((i) => !existing.has(i.id));

        return [...prev, ...filtered];
      });
      setNextLost(data.next);
    }
  };
  // useLayoutEffect(() => {
  //   const fetchItems = async () => {
  //     try {
  //       const foundData = await getItems('found');
  //       console.log(foundData);
  //       const lostData = await getItems('lost');
  //       const found = Array.isArray(foundData) ? foundData : foundData.results || [];

  //       const lost = Array.isArray(lostData) ? lostData : lostData.results || [];
  //       const allItems: Item[] = [
  //         ...found.map((item) => ({
  //           id: item.id,
  //           user: item.user,
  //           type: 'found' as const,
  //           title: item.description || 'Без названия',
  //           img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
  //           description: item.description,
  //           location_ref: item.location_ref,
  //           status: item.status,
  //           author: item.author,
  //         })),

  //         ...lost.map((item) => ({
  //           id: item.id,
  //           user: item.user,
  //           type: 'lost' as const,
  //           title: item.description || 'Без названия',
  //           img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
  //           description: item.description,
  //           location_ref: item.location_ref,
  //           status: item.status,
  //           author: item.author,
  //         })),
  //       ];

  //       setItems(allItems);
  //     } catch (e) {
  //       console.error(e);
  //       setItems(fallbackItems);
  //     }
  //   };

  //   fetchItems();
  // }, []);
  const handleItemDeleted = (id: number, type: 'found' | 'lost') => {
  setItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
};
  return (
    <>
      <ThemeProvider>
        <ToastContainer progressClassName="toast-progress" />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/main"
              element={
                <OutletWrapper
                  items={items}
                  loadMore={loadMore}
                  onItemDeleted={handleItemDeleted}
                />
              }>
              {/* <Route index element={<Sidebar />} /> */}
            </Route>
            <Route path="/ad" element={<Advertisement addItem={addItem} />} />
            <Route path="/appeal" element={<Appeal />} />
            <Route path="/appeals" element={<Appeals />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-cards" element={<MyCards items={items} />} />
            <Route path="/statistic" element={<MyStatistic items={items} appeals={appeals} />} />
            <Route path="/historyact" element={<HistoryActions />}/>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </>
  );
}

function OutletWrapper({
  items,
  loadMore,
  onItemDeleted,
}: {
  items: Item[];
  loadMore: (type: 'found' | 'lost') => Promise<void>;
  onItemDeleted: (id: number, type: 'found' | 'lost') => void;
}) {
  return (
    <div>
      <MainPage items={items} loadMore={loadMore} onItemDeleted={onItemDeleted} />
      <Outlet />
    </div>
  );
}

export default App;
