import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken } from "../../utils/auth";
import {
  onGetUser,
  onLoginOAuthFailed,
  onLoginOAuthSuccess,
} from "../../store/auth/authSlice";
import { toast } from "react-toastify";

function OAuth2RedirectPage() {
  const { errorMessage } = useSelector((state) => state.auth);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  const redirect = (userInfo) => {
    if (accessToken || refreshToken) {
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      setToken(accessToken, refreshToken);
      dispatch(onLoginOAuthSuccess());
      dispatch(onGetUser(accessToken));
      navigate("/", { userInfo });
    } else {
      const error = searchParams.get("error");
      dispatch(onLoginOAuthFailed(error));
      navigate("/login");
    }
  };

  useEffect(() => {
    redirect(location);
  }, [location.search]);

  return <div>Redirect...</div>;
}

export default OAuth2RedirectPage;
