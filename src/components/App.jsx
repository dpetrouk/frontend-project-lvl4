import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import NoMatch from './NoMatch.jsx';

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

const LoginVerification = () => {
  console.log('LoginVerification');
  const auth = useAuth();
  if (auth.loggedIn) {
    return <Redirect to="/" />;
  }
  return <Login />;
};

const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();
  console.log('PrivateRoute');
  return (
    <Route
      path={path}
      render={() => (auth.loggedIn
        ? children
        : <Redirect to="/login" />)}
    />
  );
};

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  if (!auth.loggedIn) {
    return null;
  }
  return <Button variant="outline-secondary" onClick={auth.logOut}>{t('logoutButton')}</Button>;
};

const App = () => {
  console.log('App');
  const { t } = useTranslation();

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="bg-white shadow-sm">
            <Container>
              <Link to="/" className="navbar-brand">{t('title')}</Link>
              <AuthButton />
            </Container>
          </Navbar>
          <Switch>
            <Route path="/login">
              <LoginVerification />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
