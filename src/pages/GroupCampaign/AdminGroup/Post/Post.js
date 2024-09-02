import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Post.module.css';
import dots from '../../../../Images/User/dots.png';
import CommentModal from '../../../User/CommentModal/CommentModal';
import API_BASE_URL from '../../../../config/configapi.js';

const Post = ({
    Post_ID,
    avatar,
    avatargroup,
    user_id,
    name,
    namegroup,
    time,
    content,
    image,
    likes,
    comments,
    isLike,
    comment,
    check
}) => {
    const [isLiked, setIsLiked] = useState(isLike);
    const [likeCount, setLikeCount] = useState(likes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false);
    const [commentData, setCommentData] = useState(comment);
    const [loadingLikeStatus, setLoadingLikeStatus] = useState(true);
    const navigate = useNavigate();
    const cookies = document.cookie;
    const cookiesArray = cookies.split('; ');
    const userIdCookie = cookiesArray.find(cookie => cookie.startsWith('User_ID='));
    const userId = userIdCookie ? userIdCookie.split('=')[1] : null;

    useEffect(() => {
        if (userId) {
            fetch(`${API_BASE_URL}api/getSocialPosts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Post_ID, user_id: userId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.isLiked !== undefined) {
                        setIsLiked(data.isLiked);
                    } else {
                        setIsLiked(false);
                    }
                    setLoadingLikeStatus(false);
                })
                .catch(error => {
                    console.error('Error checking like status:', error);
                    setIsLiked(false);
                    setLoadingLikeStatus(false);
                });

            fetch(`${API_BASE_URL}api/getComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Post_ID }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.comment) {
                        const comment = {
                            username: data.comment.Name,
                            avatar: data.comment.Image,
                            content: data.comment.Content,
                            imageComment: data.comment.ImageComment,
                            time: data.comment.created_at,
                        };
                        setCommentData(comment);
                    } else {
                        setCommentData(null);
                    }
                })
                .catch(error => {
                    console.error('Error fetching comment:', error);
                });
        }
    }, [Post_ID, userId]);

    const handleLikeClick = () => {
        if (userId) {
            setIsLiked(prevIsLiked => !prevIsLiked);
            setLikeCount(prevLikeCount => isLiked ? prevLikeCount - 1 : prevLikeCount + 1);

            fetch(`${API_BASE_URL}api/toogleLike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Post_ID, user_id: userId, isLike: !isLiked }),
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        console.error('Error updating like status:', data.error);
                        setIsLiked(prevIsLiked => !prevIsLiked);
                        setLikeCount(prevLikeCount => isLiked ? prevLikeCount + 1 : prevLikeCount - 1);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setIsLiked(prevIsLiked => !prevIsLiked);
                    setLikeCount(prevLikeCount => isLiked ? prevLikeCount + 1 : prevLikeCount - 1);
                });
        } else {
            navigate('/TaiKhoan');
        }
    };

    const handleCommentClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAvatarClick = () => {
        navigate(`/User?user_id=${user_id}`);
    };

    const handleDotsClick = () => {
        setIsOptionsOpen(!isOptionsOpen);
    };

    const handleDeleteClick = () => {
        setIsOptionsOpen(false);
        setIsDeleteOverlayOpen(true);
    };

    const handleConfirmDelete = () => {
        fetch(`${API_BASE_URL}api/deletePost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Post_ID }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    console.error('Error deleting post:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleCancelDelete = () => {
        setIsDeleteOverlayOpen(false);
    };

    const handleApproveClick = () => {
        fetch(`${API_BASE_URL}api/confirmCampaignPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: Post_ID, status: 'yes' }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    console.error('Error approving post:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleShare = () => {
        const shareLink = `${window.location.origin}/VietNamJourney#/Search/?post_info=${Post_ID}`;
        navigator.clipboard.writeText(shareLink)
            .then(() => {
                alert('Link đã được sao chép vào bộ nhớ tạm!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className={styles['container-post']}>
            <div className={styles['post-header']}>
                <div className={styles['post-header-avatar']} onClick={handleAvatarClick} style={{ cursor: 'pointer', position: 'relative' }}>
                    <span className={styles['square-avatar']}><img src={avatargroup} alt="avatar" /></span>
                    <img src={avatar} alt="avatar" className={styles['circle-avatar']} />
                </div>
                <div className={styles['post-header-info']}>
                    <h6 onClick={handleAvatarClick} style={{ cursor: 'pointer', fontWeight: 'revert', fontSize: '1.2rem' }}>{name} {check == 1 && <i className="fa-solid fa-circle-check" style={{ color: "#258e31", fontSize: "1rem" }}></i>} - {namegroup}</h6>
                    <span style={{ fontSize: '1rem' }}>{time} · <i className="fas fa-earth-asia"></i></span>
                </div>
            </div>
            <div className={styles['post-content']}>
                <p>{content}</p>
            </div>
            {image && <div className={styles['post-body']}>
                <img src={image} alt="post content" />
            </div>}
            <div className={styles['post-footer']}>
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                    <button className={styles.yes} onClick={handleApproveClick}>Duyệt</button>
                    <button className={styles.no} onClick={handleConfirmDelete} >Xóa</button>
                </div>
            </div>
        </div>
    );
};

export default Post;
