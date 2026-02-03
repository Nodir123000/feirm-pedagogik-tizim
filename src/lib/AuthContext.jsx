import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        // Check for mock session first
        const mockSession = localStorage.getItem('feirm_mock_session');
        if (mockSession) {
            const mockUser = { id: 'mock-user-id', email: 'Abdullaeva@feirm.uz', user_metadata: { full_name: 'A.O. Abdullaeva', avatar_url: '/kelin.jpg' } };
            setUser(mockUser);
            setSession({ user: mockUser });
            setIsAuthenticated(true);
            setIsLoadingAuth(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setIsLoadingAuth(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setIsLoadingAuth(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        // Hardcoded backdoor for specific user request
        if (email === 'Abdullaeva' && password === 'Farruh') {
            const mockUser = {
                id: 'mock-user-id',
                email: 'Abdullaeva@feirm.uz',
                user_metadata: {
                    full_name: 'A.O. Abdullaeva',
                    avatar_url: '/kelin.jpg'
                }
            };
            setUser(mockUser);
            setSession({ user: mockUser });
            setIsAuthenticated(true);
            localStorage.setItem('feirm_mock_session', 'true');
            return { user: mockUser };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        localStorage.removeItem('feirm_mock_session');
        const { error } = await supabase.auth.signOut();
        // Even if supabase errs (no session), we cleared local storage so we are good
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isAuthenticated,
            isLoadingAuth,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
