import { FaUser } from 'react-icons/fa6';
import './Advertisement.css';
import { useState } from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

function Advertisement() {
  const [type, setType] = useState("lost");
  const navigate = useNavigate();
  return (
    <>
      <div className="container-advertisement">
        <div className="header-advertisement">
          <h1>UniFind</h1>
          <FaUser className="profile-advertisement-icon" />
        </div>
        <div className="card-advertisement">
          <div className="tabs-advertisement">
            <button
              className={type === "found" ? "tab-advertisement active" : "tab-advertisement"}
              onClick={() => setType("found")}
            >
              Находка
            </button>
            <button
              className={type === "lost" ? "tab-advertisement active" : "tab-advertisement"}
              onClick={() => setType("lost")}
            >
              Пропажа
            </button>
          </div>

          <div className="input-advertisement">
            <span>Категория</span>
            <MdKeyboardArrowLeft className="arrow-advertisement"/>
          </div>

          <div className="textarea-advertisement">
            <label>Описание</label>
            <textarea />
          </div>

          <div className="photo-advertisement">
            <span>Фото</span>
            <button className="add-advertisement-btn">
              <LuCircleFadingPlus className='add-plus-icon'/>
            </button>
          </div>

          <div className="textarea-advertisement">
            <label>Место</label>
            <textarea />
          </div>

          <div className="actions-advertisement">
            <button className="submit-advertisement" onClick={() => navigate(-1)}>Готово</button>
            <button className="cancel-advertisement" onClick={() => navigate(-1)}>Отмена</button>
          </div>
        </div>
    </div>
    </>
  );
};

export { Advertisement };