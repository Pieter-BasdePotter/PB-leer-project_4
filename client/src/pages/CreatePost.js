import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const navigate = useNavigate();
    const { username } = useAuth();
    const initial = username ? username[0].toUpperCase() : '?';

    const initialValues = { title: "", postText: "" };

    const validate = ({ title, postText }) => {
        const errors = {};
        if (!title.trim()) errors.title = 'Title is required';
        if (!postText.trim()) errors.postText = 'Post content is required';
        return errors;
    };

    const handleCreate = async (data, { setSubmitting, setStatus }) => {
        try {
            await axios.post("/posts", { title: data.title, postText: data.postText });
            navigate('/');
        } catch (error) {
            setStatus({ serverError: 'Failed to publish post. Please try again.' });
            setSubmitting(false);
        }
    };

    return (
        <div className="createPostPage">
            <div className="createPostCard">
                <div className="createPostCardHeader">New Post</div>
                <Formik initialValues={initialValues} validate={validate} onSubmit={handleCreate}>
                    {({ isSubmitting, status }) => (
                        <Form>
                            <div className="createPostWho">
                                <div className="postAvatar">{initial}</div>
                                <div>
                                    <span className="createPostWhoLabel">Posting as </span>
                                    <span className="createPostWhoName">{username}</span>
                                </div>
                            </div>
                            <div className="createPostBody">
                                {status?.serverError && (
                                    <div className="createPostServerError">{status.serverError}</div>
                                )}
                                <label className="createPostLabel" htmlFor="post-title">Title</label>
                                <ErrorMessage name="title" component="div" className="createPostError" />
                                <Field id="post-title" className="createPostInput" name="title" placeholder="Give your post a title…" />

                                <label className="createPostLabel" htmlFor="post-content">Content</label>
                                <ErrorMessage name="postText" component="div" className="createPostError" />
                                <Field id="post-content" as="textarea" className="createPostTextarea" name="postText" placeholder="What's on your mind?" rows={5} />

                                <button type="submit" className="createPostSubmit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Publishing…' : 'Publish Post'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default CreatePost;
