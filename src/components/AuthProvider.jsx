import React, { useState, useMemo } from 'react';
import authContext from '../contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const { token, username } = JSON.parse(localStorage.getItem('user')) || {};
  const [loggedIn, setLoggedIn] = useState(!!token);

  const { logIn, logOut } = useMemo(() => ({
    logIn: (fetchedToken, fetchedUsername) => {
      localStorage.setItem('user', JSON.stringify({ token: fetchedToken, username: fetchedUsername }));
      setLoggedIn(true);
    },
    logOut: () => {
      localStorage.removeItem('user');
      setLoggedIn(false);
    },
  }), []);

  const value = useMemo(() => ({
    loggedIn,
    token,
    username,
    logIn,
    logOut,
  }), [loggedIn, token, username]);

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
