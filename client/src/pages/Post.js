import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios";
import { useAuth } from '../context/AuthContext';

const getInitial = (name) => name ? name[0].toUpperCase() : '?';
const getCommentAuthorName = (name) => name ? name : 'Unknown user';

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

function Post() {
  const { id } = useParams();
  const { username } = useAuth();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    axios.get(`/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    }).catch((err) => {
      console.error('Failed fetching post:', err);
    });
    axios.get(`/comments/${id}`).then((response) => {
      setComments(Array.isArray(response.data) ? response.data : []);
    }).catch((err) => {
      console.error('Failed fetching comments:', err);
    });
  }, [id]);

  const addComment = () => {
    if (!newComment.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    axios.post("/comments", { commentBody: newComment, postId: id }).then((response) => {
      setComments((prev) => [...prev, response.data]);
      setNewComment("");
    }).catch((err) => {
      console.error('Failed adding comment:', err);
    }).finally(() => {
      setIsSubmittingComment(false);
    });
  };

  const likePost = () => {
    axios.put(`/posts/${id}/like`).then((response) => {
      setPostObject((prev) => ({ ...prev, likes: response.data.likes }));
    }).catch(console.error);
  };

  const likeComment = (commentId) => {
    axios.put(`/comments/${commentId}/like`).then((response) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: response.data.likes } : c
        )
      );
    }).catch(console.error);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div className="postDetailPage">
      <div className="postDetailCard">
        <div className="postCardHeader">
          <div className="postAvatar">{getInitial(postObject.userName)}</div>
          <div className="postAvatarMeta">
            <div className="postAuthorName">{postObject.userName}</div>
            <div className="postTimestamp">{formatDate(postObject.createdAt)}</div>
          </div>
        </div>
        <div className="postCardTitle">{postObject.title}</div>
        <div className="postCardBody">{postObject.postText}</div>
        <div className="postDetailLikeRow">
          <button className="likeBtn" onClick={likePost}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Like post">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            <span>{postObject.likes ?? 0} {postObject.likes === 1 ? 'Like' : 'Likes'}</span>
          </button>
        </div>
      </div>

      <div className="commentsCard">
        <div className="commentsCardTitle">
          {comments.length === 0 ? 'Be the first to comment' : `${comments.length} Comment${comments.length === 1 ? '' : 's'}`}
        </div>
        <div className="commentInputRow">
          <div className="postAvatar">{getInitial(username)}</div>
          <input
            className="commentInputBox"
            type="text"
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="commentSubmitBtn" onClick={addComment} disabled={isSubmittingComment}>
            {isSubmittingComment ? '…' : 'Post'}
          </button>
        </div>
        {comments.map((comment) => (
          <div key={comment.id} className="commentItem">
            <div className="postAvatar">{getInitial(comment.userName)}</div>
            <div style={{ flex: 1 }}>
              <div className="commentBubble">
                <div className="commentAuthorName">{getCommentAuthorName(comment.userName)}</div>
                <div className="commentBubbleBody">{comment.commentBody}</div>
              </div>
              <div className="commentLikeRow">
                <button className="likeBtn" onClick={() => likeComment(comment.id)}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Like">
                    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                  </svg>
                  <span>{comment.likes ?? 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;
