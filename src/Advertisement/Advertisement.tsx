import { FaUser } from 'react-icons/fa6';
import './Advertisement.css';
import { useState, useRef } from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { MdDelete } from "react-icons/md";

function Advertisement() {
  const [type, setType] = useState("found");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState("Категория");
  const selectCategory = (category: string) => {
  setSelectedCategory(category);
  setCategoryOpen(false);
};
  const categories = [
    "Наушники",
    "Кошельки",
    "Ключи",
    "Одежда",
    "Подзарядки",
    "Канцелярия",
  ];
  const toggleCategory = () => {
  setCategoryOpen(!categoryOpen);
  if (!categoryOpen) {
    setSelectedCategory("Категория"); 
  }
};

  const navigate = useNavigate();
   const [userName ] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const savedName = localStorage.getItem("user_name");
      if (savedName) {
        return savedName;
      }
    }
    return "Гость";
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (file) {
    setPhoto(file);
    console.log(photo);
    setPreview(URL.createObjectURL(file));
  }
};

  const handleDeletePhoto = () => {
  setPhoto(null);
  setPreview(null);
  if (inputRef.current) {
    inputRef.current.value = '';
  }
};


  return (
    <>
      <div
        className={`sidebar-overlay-2 ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}>
        <div
          className={`sidebar-2 ${sidebarOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}>
          <Sidebar userName={userName} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <div className="container-advertisement">
        <div className="header-advertisement">
          <h1>UniFind</h1>
          <FaUser className="profile-advertisement-icon" onClick={() => setSidebarOpen(true)} />
        </div>
        <div className="card-advertisement">
          <div className="tabs-advertisement">
            <button
              className={type === 'found' ? 'tab-advertisement active' : 'tab-advertisement'}
              onClick={() => setType('found')}>
              Находка
            </button>
            <button
              className={type === 'lost' ? 'tab-advertisement active' : 'tab-advertisement'}
              onClick={() => setType('lost')}>
              Пропажа
            </button>
          </div>

          <div className="category-wrapper">
  <div className="input-advertisement" onClick={toggleCategory}>
    <span>{selectedCategory === "Категория" ? "Категория" : selectedCategory}</span>
    <MdKeyboardArrowLeft
      className={`arrow-advertisement ${categoryOpen ? 'rotated' : ''}`}
    />
  </div>

  {categoryOpen && (
    <div className="category-dropdown">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-item"
          onClick={() => selectCategory(category)}>
          {category}
        </div>
      ))}
    </div>
  )}
</div>
          <div className="textarea-advertisement">
            <label>Описание</label>
            <textarea />
          </div>

          <div className="photo-advertisement">
            <span>Фото</span>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
            {!preview ? (
              <button onClick={openPicker} className="add-advertisement-btn">
                <LuCircleFadingPlus className="add-plus-icon" />
              </button>
            ) : (
              <>
                <button onClick={handleDeletePhoto} className="delete-photo-btn">
                  <MdDelete className="delete-icon" />
                </button>
                <div className="preview-container">
                  <img src={preview} alt="preview" className="preview-image" />
                </div>
              </>
            )}
          </div>

          <div className="textarea-advertisement">
            <label>Место</label>
            <textarea />
          </div>

          <div className="actions-advertisement">
            <button className="submit-advertisement" onClick={() => navigate(-1)}>
              Готово
            </button>
            <button className="cancel-advertisement" onClick={() => navigate(-1)}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { Advertisement };