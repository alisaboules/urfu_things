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
import { getItems } from './Api/Api';


export type Item = {
  id: number;
  title: string;
  img: string;
  description: string;
  location_ref: string;
  status: string;
  user: number;
  type: 'found' | 'lost';
};

export type ApiItem = {
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
  },
];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  useLayoutEffect(() => {
    const fetchItems = async () => {
      try {
        const foundData = await getItems('found');
        console.log(foundData);
        const lostData = await getItems('lost');
        const found = Array.isArray(foundData) ? foundData : foundData.results || [];

        const lost = Array.isArray(lostData) ? lostData : lostData.results || [];
        const allItems: Item[] = [
          ...found.map((item) => ({
            id: item.id,
            user: item.user,
            type: 'found' as const,
            title: item.description || 'Без названия',
            img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
            description: item.description,
            location_ref: item.location_ref,
            status: item.status,
          })),

          ...lost.map((item) => ({
            id: item.id,
            user: item.user,
            type: 'lost' as const,
            title: item.description || 'Без названия',
            img: item.image || `${import.meta.env.BASE_URL}images/аэрподс.jpg`,
            description: item.description,
            location_ref: item.location_ref,
            status: item.status,
          })),
        ];

        setItems(allItems);
      } catch (e) {
        console.error(e);
        setItems(fallbackItems);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/main" element={<OutletWrapper items={items} />}>
            {/* <Route index element={<Sidebar />} /> */}
          </Route>
          <Route path="/ad" element={<Advertisement />} />
          <Route path="/appeal" element={<Appeal />} />
          <Route path="/appeals" element={<Appeals />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-cards" element={<MyCards items={items} />} />
        </Routes>
      </HashRouter>
    </>
  );
}

function OutletWrapper({ items }: { items: Item[] }) {
  return (
    <div>
      <MainPage items={items} />
      <Outlet />
    </div>
  );
}

export default App;
