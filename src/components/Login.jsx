import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Button,
} from 'react-bootstrap';
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
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card>
            <Card.Body className="p-5">
              <Form noValidate onSubmit={formik.handleSubmit} className="col-md-6 mt-3 mb-0">
                <h2 className="text-center mb-4">Войти</h2>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required
                    placeholder="Имя пользователя"
                    id="username"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  <Form.Label>
                    Имя пользователя
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
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
                <Button variant="outline-primary" type="submit" className="w-100 mb-3">Войти</Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              ?
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
