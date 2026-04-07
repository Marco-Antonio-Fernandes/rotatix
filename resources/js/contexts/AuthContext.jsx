import axios from 'axios';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/user');
            setUser(data);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, [refreshUser]);

    useEffect(() => {
        const id = axios.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response?.status === 401) {
                    setUser(null);
                }
                return Promise.reject(err);
            },
        );
        return () => axios.interceptors.response.eject(id);
    }, []);

    const value = useMemo(
        () => ({ user, loading, setUser, refreshUser }),
        [user, loading, refreshUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return ctx;
}
