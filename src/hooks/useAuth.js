import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../store/slices/authSlice';
import { logout as logoutAPI } from '../services/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    try {
      await logoutAPI();
      dispatch(logoutAction());
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn logout local state nếu API call thất bại
      dispatch(logoutAction());
      navigate('/auth');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout
  };
};