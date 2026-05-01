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

const VISITOR_KEY = 'rotatix_visitor';

function readVisitorStorage() {
    return (
        typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem(VISITOR_KEY) === '1'
    );
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [visitorMode, setVisitorMode] = useState(readVisitorStorage);
    const [loading, setLoading] = useState(() => !readVisitorStorage());

    const refreshUser = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/user');
            setUser(data);
        } catch {
            setUser(null);
        }
    }, []);

    const enterVisitorMode = useCallback(async () => {
        try {
            await axios.post(route('logout'));
        } catch {
            //
        }
        setUser(null);
        sessionStorage.setItem(VISITOR_KEY, '1');
        setVisitorMode(true);
    }, []);

    const leaveVisitorMode = useCallback(() => {
        sessionStorage.removeItem(VISITOR_KEY);
        setVisitorMode(false);
    }, []);

    useEffect(() => {
        if (visitorMode) {
            setUser(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        refreshUser().finally(() => setLoading(false));
    }, [visitorMode, refreshUser]);

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
        () => ({
            user,
            loading,
            visitorMode,
            setUser,
            refreshUser,
            enterVisitorMode,
            leaveVisitorMode,
        }),
        [user, loading, visitorMode, refreshUser, enterVisitorMode, leaveVisitorMode],
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
