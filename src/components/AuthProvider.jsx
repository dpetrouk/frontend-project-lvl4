import React, { useState } from 'react';
import authContext from '../contexts/index.jsx';

const setLocalAuth = (token, username) => {
  localStorage.setItem('user', JSON.stringify({ token, username }));
};

const getLocalAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user;
};

const removeLocalAuth = () => {
  localStorage.removeItem('user');
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getLocalAuth()?.token);
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [username, setUsername] = useState(getLocalAuth()?.username);

  const logIn = (t, u) => {
    setLocalAuth(t, u);
    setToken(t);
    setUsername(u);
    setLoggedIn(true);
  };
  const logOut = () => {
    removeLocalAuth();
    setToken('');
    setUsername('');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn,
      token,
      username,
      setUsername,
      logIn,
      logOut,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
