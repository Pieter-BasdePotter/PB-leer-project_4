import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import axios from "axios";  


function CreatePost() {

const initialValues = {
  title: "",
  postText: "",
  userName: ""
};
const onSubmit = (data) => {
  axios.post("http://localhost:3001/posts", data)
      .then((response) => {
        console.log('Post created successfully', response.data);
    })
};

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
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
