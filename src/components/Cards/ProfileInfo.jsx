import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-emerald-500">
        {getInitials(userInfo.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button className="text-sm underline" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

ProfileInfo.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default ProfileInfo;
