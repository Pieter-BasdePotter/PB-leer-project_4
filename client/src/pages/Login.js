import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [serverError, setServerError] = useState('');

    const validate = ({ email, password }) => {
        const errors = {};
        if (!email) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
        if (!password) errors.password = 'Password is required';
        return errors;
    };

    const handleLogin = async ({ email, password }, { setSubmitting }) => {
        setServerError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.username);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401) {
                setServerError('Invalid email or password.');
            } else {
                setServerError('Login failed. Please try again.');
            }
            setSubmitting(false);
        }
    };

    return (
        <div className="createPostPage">
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={validate}
                onSubmit={handleLogin}
            >
                {({ isSubmitting }) => (
                    <Form className="formContainer">
                        <div className="authFormHeader">Log In</div>
                        {serverError && <span className="serverError">{serverError}</span>}

                        <label>Email:</label>
                        <ErrorMessage name="email" component="span" />
                        <Field
                            type="email"
                            id="inputCreatePost"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                        />

                        <label>Password:</label>
                        <ErrorMessage name="password" component="span" />
                        <Field
                            type="password"
                            id="inputCreatePost"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                        />

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in…' : 'Log In'}
                        </button>

                        <p className="authSwitch">
                            Don't have an account?{' '}
                            <Link to="/register">Register here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
