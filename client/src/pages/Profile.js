import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const getInitial = (name) => name ? name[0].toUpperCase() : '?';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
};

const formatPostDate = (dateStr) => {
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

function Profile() {
    const { username } = useParams();
    const { username: currentUsername } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState('');

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError('');
        axios.get(`/profile/${username}`)
            .then((res) => { if (isMounted) setProfile(res.data); })
            .catch((err) => {
                if (!isMounted) return;
                if (err.response?.status === 404) {
                    setError('User not found.');
                } else {
                    setError('Failed to load profile. Please try again.');
                }
            })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, [username]);

    const handleFollow = async () => {
        if (!profile) return;
        setFollowLoading(true);
        setFollowError('');
        try {
            const isFollowing = profile.isFollowing;
            const res = await (isFollowing
                ? axios.delete(`/profile/${username}/follow`)
                : axios.post(`/profile/${username}/follow`));
            setProfile((prev) => ({
                ...prev,
                isFollowing: res.data.following,
                followerCount: res.data.followerCount,
            }));
        } catch (err) {
            setFollowError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setFollowLoading(false);
        }
    };

    const isOwnProfile = currentUsername?.toLowerCase() === username?.toLowerCase();

    if (loading) {
        return (
            <div className="profilePage">
                <div className="profileLoadingState">Loading profile…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profilePage">
                <div className="profileErrorState">{error}</div>
            </div>
        );
    }

    const { user, posts, followerCount, followingCount, isFollowing } = profile;

    return (
        <div className="profilePage">
            {/* Profile header card */}
            <div className="profileHeaderCard">
                <div className="profileCover" />
                <div className="profileHeaderBody">
                    <div className="profileAvatarWrap">
                        <div className="profileAvatar">{getInitial(user.username)}</div>
                    </div>
                    <div className="profileHeaderInfo">
                        <div className="profileUsername">{user.username}</div>
                        <div className="profileJoined">Member since {formatDate(user.createdAt)}</div>
                    </div>
                    {!isOwnProfile && (
                        <div className="profileFollowWrap">
                            {followError && (
                                <div className="profileFollowError">{followError}</div>
                            )}
                            <button
                                className={`profileFollowBtn${isFollowing ? ' profileFollowBtn--following' : ''}`}
                                onClick={handleFollow}
                                disabled={followLoading}
                            >
                                {followLoading
                                    ? '…'
                                    : isFollowing
                                        ? '✓ Following'
                                        : '+ Follow'}
                            </button>
                        </div>
                    )}
                </div>
                <div className="profileStatRow">
                    <div className="profileStatItem">
                        <span className="profileStatCount">{posts.length}</span>
                        <span className="profileStatLabel">Posts</span>
                    </div>
                    <div className="profileStatDivider" />
                    <div className="profileStatItem">
                        <span className="profileStatCount">{followerCount}</span>
                        <span className="profileStatLabel">Followers</span>
                    </div>
                    <div className="profileStatDivider" />
                    <div className="profileStatItem">
                        <span className="profileStatCount">{followingCount}</span>
                        <span className="profileStatLabel">Following</span>
                    </div>
                </div>
            </div>

            {/* Posts section */}
            <div className="profilePostsSection">
                <div className="profilePostsSectionTitle">
                    {isOwnProfile ? 'Your posts' : `Posts by ${user.username}`}
                </div>
                {posts.length === 0 ? (
                    <div className="profileNoPosts">No posts yet.</div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="postCard"
                            onClick={() => navigate(`/post/${post.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    navigate(`/post/${post.id}`);
                                }
                            }}
                        >
                            <div className="postCardHeader">
                                <div className="postAvatar">{getInitial(post.userName)}</div>
                                <div className="postAvatarMeta">
                                    <div className="postAuthorName">{post.userName}</div>
                                    <div className="postTimestamp">{formatPostDate(post.createdAt)}</div>
                                </div>
                            </div>
                            <div className="postCardTitle">{post.title}</div>
                            <div className="postCardBody">{post.postText}</div>
                            <div className="postCardStats">
                                <div className="statBubble">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                                    </svg>
                                    <span>{post.likes ?? 0} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;
