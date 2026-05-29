import { FaUser } from "react-icons/fa6";
import "../Sidebar.css";
import { useNavigate } from "react-router-dom";

function SidebarUser( { userName, onClose }: { userName: string; onClose: () => void }){
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <aside className="sidebar-container">
      <div className="userProfile">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="header-avatar"
            onClick={() => onClose()}
          />
        ) : (
          <FaUser className="profile-sidebar-icon" onClick={() => onClose()} />
        )}
        <div className="userName">{userName}</div>
      </div>
      <div className="navigation">
        <button
          className="user-data"
          onClick={() => {
            navigate('/profile');
          }}>
          Профиль
        </button>
        <button
          className="user-data"
          onClick={() => {
            navigate('/my-cards');
          }}>
          Мои объявления
        </button>
        <button
          className="user-data"
          onClick={() => {
            navigate('');
          }}>
          Мои статусы
        </button>
      </div>
    </aside>
  );
}

export { SidebarUser };