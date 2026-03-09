import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";  

function Post() {
  let { id } = useParams(); 
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(Array.isArray(response.data) ? response.data : []);
    }).catch((err) => {
      console.error('Failed fetching comments:', err);
    });
  }, [id]);

  const addComment = () => {
    axios.post("http://localhost:3001/comments", { commentBody: newComment, postId: id }).then((response) => {
      console.log("Comment added:", response.data);
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    }).catch((err) => {
      console.error('Failed adding comment:', err);
    });
  };

  const likePost = () => {
    axios.put(`http://localhost:3001/posts/${id}/like`).then((response) => {
      setPostObject((prev) => ({ ...prev, likes: Math.max(prev.likes ?? 0, response.data.likes) }));
    }).catch((err) => {
      console.error('Failed liking post:', err);
    });
  };

  const likeComment = (commentId) => {
    axios.put(`http://localhost:3001/comments/${commentId}/like`).then((response) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: Math.max(c.likes ?? 0, response.data.likes) } : c
        )
      );
    });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title">{postObject.title}</div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">{postObject.userName}</div>
          <div className="postLikeFooter">
            <button className="likeBtn" onClick={likePost}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Like post">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
              </svg>
              <span>{postObject.likes ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer"> 
          <input type="text" placeholder="Comment..." value={newComment} onChange={(event) => setNewComment(event.target.value)}/>
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="commentBody">{comment.commentBody}</div>
              <div className="commentFooter">
                <button className="likeBtn" onClick={() => likeComment(comment.id)}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Like">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                  <span>{comment.likes ?? 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Post
