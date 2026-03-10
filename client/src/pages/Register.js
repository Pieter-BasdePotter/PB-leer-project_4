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
        <div className="createPostPage">
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                validate={validate}
                onSubmit={handleRegister}
            >
                {({ isSubmitting }) => (
                    <Form className="formContainer">
                        <div className="authFormHeader">Create Account</div>
                        {serverError && <span className="serverError">{serverError}</span>}

                        <label>Username:</label>
                        <ErrorMessage name="username" component="span" />
                        <Field
                            id="inputCreatePost"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                        />

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
                            placeholder="Password (min 6 characters)"
                            autoComplete="new-password"
                        />

                        <label>Confirm Password:</label>
                        <ErrorMessage name="confirmPassword" component="span" />
                        <Field
                            type="password"
                            id="inputCreatePost"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                        />

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account…' : 'Register'}
                        </button>

                        <p className="authSwitch">
                            Already have an account?{' '}
                            <Link to="/login">Log in here</Link>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Register;
