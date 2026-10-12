import { useCallback, useState } from 'react';
import { apiFetch } from '../api/index.js';

export function useApi() {
  const [state, setState] = useState({ loading: false, error: null });
  const request = useCallback(async (path, options) => {
    setState({ loading: true, error: null });
    try {
      const data = await apiFetch(path, options);
      setState({ loading: false, error: null });
      return data;
    } catch (error) {
      setState({ loading: false, error: error.message });
      throw error;
    }
  }, []);
  return { ...state, request };
}
