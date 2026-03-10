import React from 'react'
import axios from "../api/axios";  
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
    axios.get("/posts")
      .then((response) => {
        setListOfPosts(response.data);
      })
      .catch((err) => {
        console.error('Failed fetching posts', err);
      });
  }, []);
  return (
    <div>
      {listOfPosts.map((value) => {
        return (
          <div className='post' onClick={() => {navigate(`/post/${value.id}`)}}>
            <div className='title'>{value.title}</div>
            <div className='body'>{value.postText}</div>
            <div className='footer'>{value.userName}</div>
          </div>
        );
      })}
    </div>
  )
}

export default Home
