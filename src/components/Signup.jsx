import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Container, Row, Col, Card, Form, Button,
} from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import routes from '../routes.js';
import useAuth from '../hooks/index.jsx';

const generateOnSubmit = ({ history, auth, setIsInvalid }) => async (values) => {
  try {
    const { data } = await axios.post(routes.signupPath(), values);
    auth.logIn(data.token, data.username);
    history.push('/');
  } catch (error) {
    if (error.isAxiosError) {
      const { status } = error.response;
      if (status === 409) {
        setIsInvalid(true);
      }
    }
  }
};

const Signup = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const auth = useAuth();

  const [isInvalid, setIsInvalid] = useState(false);

  const validationSchema = yup.object({
    username: yup.string().required('signupForm.errors.required').min(3, 'signupForm.errors.usernameLength').max(20, 'signupForm.errors.usernameLength'),
    password: yup.string().required('signupForm.errors.required').min(6, 'signupForm.errors.passwordLength'),
    passwordConfirmation: yup.string().oneOf([yup.ref('password')], 'signupForm.errors.confirmPasswordMatch'),
  });

  const f = useFormik({
    onSubmit: generateOnSubmit({ history, auth, setIsInvalid }),
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    validateOnChange: false,
  });

  console.log({ f });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card>
            <Card.Body className="p-5">
              <Form noValidate onSubmit={f.handleSubmit} className="col-md-6 mt-3 mb-0">
                <h2 className="text-center mb-4">{t('signupForm.header')}</h2>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required
                    placeholder={t('signupForm.username')}
                    id="username"
                    isInvalid={(f.touched.username && f.errors.username) || isInvalid}
                    onBlur={f.handleBlur}
                    onChange={f.handleChange}
                    value={f.values.username}
                    autoFocus
                  />
                  <Form.Label>
                    {t('signupForm.username')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>{t(f.errors.username)}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    autoComplete="new-password"
                    id="password"
                    name="password"
                    type="password"
                    required
                    isInvalid={(f.touched.password && f.errors.password) || isInvalid}
                    onBlur={f.handleBlur}
                    onChange={f.handleChange}
                    value={f.values.password}
                    placeholder={t('signupForm.password')}
                  />
                  <Form.Label>
                    {t('signupForm.password')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>{t(f.errors.password)}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    autoComplete="new-password"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    required
                    isInvalid={
                      (f.touched.passwordConfirmation && f.errors.passwordConfirmation) || isInvalid
                    }
                    onBlur={f.handleBlur}
                    onChange={f.handleChange}
                    value={f.values.passwordConfirmation}
                    placeholder={t('signupForm.confirmPassword')}
                  />
                  <Form.Label>
                    {t('signupForm.confirmPassword')}
                  </Form.Label>
                  <Form.Control.Feedback type="invalid" tooltip>{t(f.errors.passwordConfirmation || 'signupForm.errors.userAlreadyExists')}</Form.Control.Feedback>
                </Form.Group>
                <Button variant="outline-primary" type="submit" className="w-100 mb-3">{t('signupForm.submit')}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
