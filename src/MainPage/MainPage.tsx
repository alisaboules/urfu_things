import './MainPage.css';
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const items = [
  { id: 1, title: "Кошелёк", img: `${import.meta.env.BASE_URL}images/wallet.jpg` },
  { id: 2, title: "Ключи", img: `${import.meta.env.BASE_URL}images/keys.jpeg` },
  { id: 3, title: "Наушники AirPods", img: `${import.meta.env.BASE_URL}images/headphones.jpg` },
  { id: 4, title: "Зарядка от ноутбука", img: `${import.meta.env.BASE_URL}images/charger.jpg` },
  { id: 5, title: "Канцелярия", img: `${import.meta.env.BASE_URL}images/canc.jpeg` },
  { id: 6, title: "Одежда", img: `${import.meta.env.BASE_URL}images/hat.jpeg` },
];

function MainPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container_header_homepage">
        <div className="header">
          <h1>UniFind</h1>
          <FaUser className="profile-icon" />
        </div>

        <div className="search">
          <IoIosSearch className="icon-search" />
          <input type="text" placeholder="Поиск" />
        </div>
      </div>
      <div className="container_main_homepage">
        <div className="phon">
          <div className="tabs">
            <button className="active">Потерянные</button>
            <button className="no-active">Найденные</button>
          </div>
          <button className="filter">Фильтры</button>

          <div className="grid">
            {items.map((item) => (
          
              <div key={item.id} className="card">
                <div className="card-image-main">
                  <img src={item.img} alt={item.title} />
                </div>
                <div className="card-title">{item.title}</div>
              </div>
             

            ))}
          </div>
        </div>
      </div>

      <button className="fab" onClick={() => navigate("/ad")}>
        <FaPlus />
      </button>
    </>
  );
}

export { MainPage };