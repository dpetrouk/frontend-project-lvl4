import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Container, Navbar, Button } from 'react-bootstrap';

import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import NoMatch from './NoMatch.jsx';

const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('getting user');
  return user;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getUser()?.token);
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [username, setUsername] = useState(getUser()?.username);

  const logIn = (t, u) => {
    setToken(t);
    setUsername(u);
    setLoggedIn(true);
  };
  const logOut = () => {
    localStorage.removeItem('user');
    setToken('');
    setLoggedIn(false);
    setUsername('');
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
  const auth = useAuth();
  if (!auth.loggedIn) {
    return null;
  }
  return <Button variant="outline-secondary" onClick={auth.logOut}>Выйти</Button>;
};

const App = () => {
  console.log('App');

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar className="bg-white shadow-sm">
            <Container>
              <Navbar.Brand href="/">Чат</Navbar.Brand>
              <AuthButton />
            </Container>
          </Navbar>
          <Switch>
            <Route path="/login">
              <LoginVerification />
            </Route>
            <PrivateRoute exact path="/">
              <Home />
            </PrivateRoute>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
