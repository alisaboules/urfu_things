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
      <button className="user-data">Профиль</button>
      <button className="user-data">Мои объявления</button>
      <button className="user-data">Мои статусы</button>
      <button className="user-data">История действий</button>
      <button className="user-data" onClick={() => { navigate("/appeal"); onClose(); }}>
        Обращение в администрацию
      </button>
      </div>
    </aside>
  );
}

export { SidebarUser };