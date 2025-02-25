import { useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";
import PropTypes from "prop-types";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 flex items-center justify-between px-6 py-2 drop-shadow z-50">
      <p></p>
      {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

Navbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default Navbar;
