import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import axios from "../api/axios";  
import { useNavigate } from 'react-router-dom';


function CreatePost() {
    const navigate = useNavigate();

    const handleCreate = async (data) => {
        try {
            await axios.post("/posts", data);
            navigate('/');
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const initialValues = {
        title: "",
        postText: "",
        userName: ""
    };
// video 5 Pedrotech
    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={handleCreate}
            >
                <Form className="formContainer">
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span" />
                    <Field id="inputCreatepost" name="title" placeholder="Title" />
                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span" />
                    <Field id="inputCreatepost" name="postText" placeholder="Post Text" />
                    <label>User Name: </label>
                    <ErrorMessage name="userName" component="span" />
                    <Field id="inputCreatepost" name="userName" placeholder="User Name" />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost
