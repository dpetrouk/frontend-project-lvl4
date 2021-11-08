import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';

const Home = () => {
  console.log('Home');
  return (
    <h2>
      Home
    </h2>
  );
};

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const Login = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      // block submit button and inputs
      const valid = await validationSchema.isValid(values);
      setAuthFailed(!valid);
      console.log(valid, values);
      // JSON.stringify(values, null, 2);
    },
  });

  return (
    <div>
      <h2>Login</h2>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <FloatingLabel
          label="Имя пользователя"
          className="mb-3"
        >
          <Form.Control
            id="username"
            name="username"
            type="text"
            required
            isInvalid={authFailed}
            onChange={formik.handleChange}
            value={formik.values.username}
            placeholder="Имя пользователя"
            className="form-control"
          />
        </FloatingLabel>
        <FloatingLabel
          label="Пароль"
          className="mb-3"
        >
          <Form.Control
            id="password"
            name="password"
            type="password"
            required
            isInvalid={authFailed}
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Пароль"
            className="form-control"
          />
          <Form.Control.Feedback type="invalid" className="invalid-tooltip">the username or password is incorrect</Form.Control.Feedback>
        </FloatingLabel>
        <Button type="submit">Войти</Button>
      </Form>
    </div>
  );
};

const NoMatch = () => {
  console.log('Not found');
  return (
    <p>
      Page not found
    </p>
  );
};

const App = () => {
  console.log('App started!');
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <br />
          <Link to="login">Login</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
