import { FaUser } from "react-icons/fa6";
import '../Sidebar.css';
import { useNavigate } from "react-router-dom";

function SidebarAdmin({
  userName,
  role,
  onClose,
}: {
  userName: string;
  role: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  return (
     <aside className="sidebar-container">
      <div className="userProfile">
        <FaUser className="profile-sidebar-icon" onClick={onClose} />
        <div className="roles">
          <div className="userName">{userName}</div>
          <div className="userRole">{role}</div>
        </div>
      </div>
      <div className="navigation">
        <button className="user-data" onClick={() => { navigate("/profile")}}>Профиль</button>
        <button className="user-data" onClick={() => { navigate("/appeals"); onClose(); }}>
          Обращения
        </button>
        <button className="user-data" onClick={() => { navigate("/magazine"); onClose(); }}>
          Журнал действий
        </button>
        <button className="user-data">Справочники</button>
        <button className="user-data">Статистика</button>
      </div>
    </aside>
  );
}

export { SidebarAdmin };