import React from 'react';
import axios from "../api/axios";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getInitial = (name) => name ? name[0].toUpperCase() : '?';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/posts")
      .then((response) => setListOfPosts(response.data))
      .catch((err) => console.error('Failed fetching posts', err));
  }, []);

  return (
    <div className="feedPage">
      {listOfPosts.map((post) => (
        <div
          key={post.id}
          className="postCard"
          onClick={() => navigate(`/post/${post.id}`)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/post/${post.id}`); } }}
        >
          <div className="postCardHeader">
            <div className="postAvatar">{getInitial(post.userName)}</div>
            <div className="postAvatarMeta">
              <div className="postAuthorName">{post.userName}</div>
              <div className="postTimestamp">{formatDate(post.createdAt)}</div>
            </div>
          </div>
          <div className="postCardTitle">{post.title}</div>
          <div className="postCardBody">{post.postText}</div>
          <div className="postCardStats">
            <div className="statBubble">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{post.likes ?? 0} {post.likes === 1 ? 'Like' : 'Likes'}</span>
            </div>
          </div>
          <div className="postCardActions">
            <button
              className="postActionBtn"
              onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              Like
            </button>
            <button
              className="postActionBtn"
              onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
              </svg>
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
