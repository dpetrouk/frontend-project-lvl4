import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const validationSchema = yup.object().shape({
  username: yup.string().trim().required(),
  password: yup.string().required(),
});

const Login = () => {
  const auth = useAuth();
  const history = useHistory();
  const [authFailed, setAuthFailed] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      // block submit button and inputs
      const valid = await validationSchema.isValid(values);
      // separate client-side and server-side validation?
      if (!valid) {
        setAuthFailed(!valid);
        return;
      }
      console.log(values);
      try {
        const response = await axios.post(routes.loginPath(), values);
        const { token, username } = response.data;
        console.log(token, username);
        localStorage.setItem('user', JSON.stringify({ token, username }));
        auth.logIn(token, username);
        history.push('/');
      } catch (error) {
        if (error.isAxiosError) {
          setAuthFailed(true);
        }
      }
    },
  });

  return (
    <div>
      <h2>Login</h2>
      <Form noValidate onSubmit={formik.handleSubmit} className="col-md-6 mt-3 mb-0">
        <Form.Group className="form-floating mb-3">
          <Form.Control
            autoComplete="username"
            id="username"
            name="username"
            required
            isInvalid={authFailed}
            onChange={formik.handleChange}
            value={formik.values.username}
            placeholder="Имя пользователя"
          />
          <Form.Label>
            Имя пользователя
          </Form.Label>
        </Form.Group>
        <Form.Group className="form-floating mb-3">
          <Form.Control
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            required
            isInvalid={authFailed}
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Пароль"
          />
          <Form.Label>
            Пароль
          </Form.Label>
          <Form.Control.Feedback type="invalid" className="invalid-tooltip">Неверное имя пользователя или пароль</Form.Control.Feedback>
        </Form.Group>
        <Button variant="outline-primary" type="submit">Войти</Button>
      </Form>
    </div>
  );
};

export default Login;
