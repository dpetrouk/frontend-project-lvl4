import React, { useState } from 'react';
import authContext from '../contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const { token, username } = JSON.parse(localStorage.getItem('user')) || {};
  const [loggedIn, setLoggedIn] = useState(!!token);

  const logIn = (fetchedToken, fetchedUsername) => {
    localStorage.setItem('user', JSON.stringify({ token: fetchedToken, username: fetchedUsername }));
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{
      loggedIn,
      token,
      username,
      logIn,
      logOut,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
