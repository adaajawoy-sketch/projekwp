
import axios from 'axios';
import { auth } from '@/auth';

export const getApiClient = async () => {
  const session = await auth();
  const token = session?.accessToken;

  const instance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return instance;
};
