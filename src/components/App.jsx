import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';

import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import NoMatch from './NoMatch.jsx';

const isTokenPresent = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(isTokenPresent());

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const LoginVerification = () => {
  console.log('LoginVerification');
  const auth = useAuth();
  if (!auth.loggedIn && isTokenPresent()) {
    auth.logIn();
  }
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
  return auth.loggedIn
    ? <Button onClick={auth.logOut}>Выйти</Button>
    : <Button as={Link} to="/login">Войти</Button>;
};

const App = () => {
  console.log('App');

  return (
    <AuthProvider>
      <Router>
        <div>
          <Nav>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <AuthButton />
          </Nav>
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
