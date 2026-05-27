import { FaUser } from "react-icons/fa6";
import "../Sidebar.css";
import { useNavigate } from "react-router-dom";

function SidebarUser( { userName, onClose }: { userName: string; onClose: () => void }){
  const navigate = useNavigate();
  return (
     <aside className="sidebar-container">
      <div className="userProfile">
        <FaUser className="profile-sidebar-icon" onClick={onClose} />
        <div className="userName">{userName}</div>
      </div>
      <div className="navigation">
      <button className="user-data" onClick={() => { navigate("/profile") }}>
          Профиль
      </button>
      <button className="user-data" onClick={() => { navigate("/my-cards") }}>
        Мои объявления
      </button>
      <button className="user-data" onClick={() => { navigate("/my-statuses") }}>
        Мои статусы
      </button>
      <button className="user-data" onClick={() => { navigate("/activity-history") }}>
        История действий
      </button>
      </div>
    </aside>
  );
}

export { SidebarUser };