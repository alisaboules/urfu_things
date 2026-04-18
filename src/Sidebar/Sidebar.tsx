import { FaUser } from "react-icons/fa6";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar( { onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
     <aside className="sidebar-container">
      <div className="userProfile">
        <FaUser className="profile-sidebar-icon" onClick={onClose} />
        <div className="userName">Иван</div>
      </div>
      <div className="navigation">
      <button className="user-data">Профиль</button>
      <button className="user-data">Мои объявления</button>
      <button className="user-data">Мои статусы</button>
      <button className="user-data">История действий</button>
      </div>
    </aside>
  );
}

export { Sidebar };