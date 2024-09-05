import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './User.module.css';
import Friends from './Friend/Friends.js';
import Post from './Post/Post.js';
import Information from './Information/Information.js';
import { useCheckCookie } from '../../Cookie/getCookie';
import NewPost from './NewPost/NewPost.js';
import { Skeleton } from 'antd';
import API_BASE_URL from '../../config/configapi.js';
import ButtonMini from "../../component/ButtonMini/ButtonMini.js";

function User() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('user_id');
  const user_ID = useCheckCookie('User_ID', '/TaiKhoan');
  
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null); 
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  const handlePost = () => {
    setIsPostOpen(!isPostOpen);
  }

  useEffect(() => {
    setLoading(true); 
    if (user_id) {
      fetch(`${API_BASE_URL}api/getPosts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user_id }) 
      })
      .then(response => response.json())
      .then(data => {
        setLoading(false); 
        if (data.posts) {
          setPosts(data.posts);
          setUser(data.user); 
        } else {
          setPosts([]);
          setUser(null); 
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false); 
        setPosts([]); 
        setUser(null); 
      });
    }
  }, [user_id]);

  return (
    <div className="container" style={{ marginTop: '1rem' }}>
      <div className="row">
        <div className="col-md-4 col-lg-4">
          <div className={styles.sticky}>
            <Information user_ID={user_id} />
            {user_ID != null && 
              <div className={styles.container2}>
                <p style={{ marginLeft: '1rem', paddingTop: '1rem', fontWeight: 'revert', fontSize: '1.5rem' }}>Gợi ý cho bạn</p>
                <Friends User_ID={user_ID} />
              </div>
            }
          </div>
        </div>
        <div className="col-md-8 col-lg-8">
          {user && user.avatar && user_ID == user_id && (
            <>
              <div className={styles.container3}>
                <div className={styles['container3-top']}>
                  <div className={styles['container3-top-avatar']}>
                    <img src={user.avatar} alt="Avatar" />
                  </div>
                  <button onClick={handlePost}>Hãy viết gì đó cho bài viết của bạn...</button>
                  {isPostOpen && <NewPost onClose={handlePost} User_ID_Post={1} />}
                </div>
              </div>
              <hr className={styles['black-line']} />
            </>
          )}
          <div className={styles.container4}>
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '2rem', backgroundColor: 'white', borderRadius: '10px', padding: '2rem', fontWeight: 'revert' }}>
                <Skeleton active />
              </div>
            ) : (
              posts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem', backgroundColor: 'white', borderRadius: '10px', padding: '2rem', fontWeight: 'revert' }}>
                  Hiện chưa có bài viết nào.
                </div>
              ) : (
                posts.map(post => (
                  <Post
                    key={post.id}
                    Post_ID={post.id}
                    user_id={post.user_id}
                    avatar={post.user_avatar} 
                    name={post.user_name} 
                    time={post.created_at}
                    content={post.content}
                    image={post.image} 
                    likes={post.likes}
                    comments={post.comments}
                    check={user.check}
                  />
                ))
              )
            )}
          </div>
        </div>
      </div>

      <ButtonMini />
    </div>
  );
}

export default User;