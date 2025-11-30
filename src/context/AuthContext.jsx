import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('gesfin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    // In a real app, this would verify credentials
    const mockUser = { name: 'Usuario', email };
    setUser(mockUser);
    localStorage.setItem('gesfin_user', JSON.stringify(mockUser));
    return true;
  };

  const register = (name, email, password) => {
    // Mock register logic
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('gesfin_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gesfin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
