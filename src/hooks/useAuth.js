import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../store/slices/authSlice";
import { logout as logoutAPI } from "../services/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    // Khôi phục auth state khi component mount
    dispatch(restoreAuthState());
  }, [dispatch]);
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
};
