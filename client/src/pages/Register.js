import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const validate = ({ username, email, password, confirmPassword }) => {
        const errors = {};
        if (!username) errors.username = 'Username is required';
        else if (username.length < 3) errors.username = 'At least 3 characters';
        if (!email) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address';
        if (!password) errors.password = 'Password is required';
        else if (password.length < 6) errors.password = 'At least 6 characters';
        if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
        else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
        return errors;
    };

    const handleRegister = async ({ username, email, password }, { setSubmitting }) => {
        setServerError('');
        try {
            await api.post('/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            if (err.response?.status === 409) {
                setServerError(err.response.data.error);
            } else {
                setServerError('Registration failed. Please try again.');
            }
            setSubmitting(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authBrand">
                <div className="authBrandLogo">GreenBook</div>
                <div className="authBrandTagline">
                    Join the community. Share your thoughts, connect with others.
                </div>
                <div className="authBrandDots">
                    <div className="authBrandDot" />
                    <div className="authBrandDot active" />
                    <div className="authBrandDot" />
                </div>
            </div>
            <div className="authPanel">
                <div className="authFormCard">
                    <div className="authFormTitle">Create Account</div>
                    <div className="authFormSubtitle">Join GreenBook today — it's free.</div>
                    {serverError && <div className="authServerError">{serverError}</div>}
                    <Formik
                        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                        validate={validate}
                        onSubmit={handleRegister}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <label className="authLabel" htmlFor="reg-username">Username</label>
                                <ErrorMessage name="username" component="span" className="authError" />
                                <Field id="reg-username" className="authInput" name="username" placeholder="Username" autoComplete="username" />

                                <label className="authLabel" htmlFor="reg-email">Email</label>
                                <ErrorMessage name="email" component="span" className="authError" />
                                <Field id="reg-email" type="email" className="authInput" name="email" placeholder="your@email.com" autoComplete="email" />

                                <label className="authLabel" htmlFor="reg-password">Password</label>
                                <ErrorMessage name="password" component="span" className="authError" />
                                <Field id="reg-password" type="password" className="authInput" name="password" placeholder="Password (min 6 characters)" autoComplete="new-password" />

                                <label className="authLabel" htmlFor="reg-confirmPassword">Confirm Password</label>
                                <ErrorMessage name="confirmPassword" component="span" className="authError" />
                                <Field id="reg-confirmPassword" type="password" className="authInput" name="confirmPassword" placeholder="Confirm Password" autoComplete="new-password" />

                                <button type="submit" className="authSubmit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating account…' : 'Register'}
                                </button>
                                <div className="authDivider" />
                                <p className="authSwitch">
                                    Already have an account?{' '}
                                    <Link to="/login">Log in here</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default Register;
