import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    type User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    type UserCredential
} from 'firebase/auth';
import { auth } from '../lib/firebaseClient';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, pass: string) => Promise<UserCredential>;
    signUp: (email: string, pass: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
    const signUp = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
