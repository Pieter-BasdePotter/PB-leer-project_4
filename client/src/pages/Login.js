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
        <div className="authPage">
            <div className="authBrand">
                <div className="authBrandLogo">GreenBook</div>
                <div className="authBrandTagline">
                    Connect with friends and share what matters most to you.
                </div>
                <div className="authBrandDots">
                    <div className="authBrandDot active" />
                    <div className="authBrandDot" />
                    <div className="authBrandDot" />
                </div>
            </div>
            <div className="authPanel">
                <div className="authFormCard">
                    <div className="authFormTitle">Log In</div>
                    <div className="authFormSubtitle">Welcome back! Sign in to continue.</div>
                    {serverError && <div className="authServerError">{serverError}</div>}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validate={validate}
                        onSubmit={handleLogin}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <label className="authLabel" htmlFor="login-email">Email</label>
                                <ErrorMessage name="email" component="span" className="authError" />
                                <Field id="login-email" type="email" className="authInput" name="email" placeholder="your@email.com" autoComplete="email" />

                                <label className="authLabel" htmlFor="login-password">Password</label>
                                <ErrorMessage name="password" component="span" className="authError" />
                                <Field id="login-password" type="password" className="authInput" name="password" placeholder="Password" autoComplete="current-password" />

                                <button type="submit" className="authSubmit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in…' : 'Log In'}
                                </button>
                                <div className="authDivider" />
                                <p className="authSwitch">
                                    Don't have an account?{' '}
                                    <Link to="/register">Register here</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default Login;
