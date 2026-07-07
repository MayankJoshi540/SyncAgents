import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/user.slice';
import api from '../../utils/axios';

export default function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/auth/currentuser');
        if (data) {
          dispatch(setUserData(data));
        }
      } catch (err) {
        console.log("No active session:", err.message);
      }
    };
    fetchUser();
  }, [dispatch]);
}
