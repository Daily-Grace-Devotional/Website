import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import config from "../../config";


const UpdateList = () => {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loadingStates, setLoadingStates] = useState([]);

  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // Load more posts when the user is close to the bottom
      getAllPosts(offset, 20);
    }
  };

  useEffect(() => {
    getAllPosts();
    window.addEventListener('scroll', handleScroll);

    // Remove scroll event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getAllPosts = async (currentOffset = 0, limit = 20) => {
    try {
      const response = await axios.post(`${config.API_URL}/graphql-server`, {
        query: `
          query GetAllPosts($offset: Int, $limit: Int) {
            posts(offset: $offset, limit: $limit) {
              id
              topic
              text
              audioName
              imageName
              date
            }
          }
        `,
      });

      setLoadingStates(new Array(response.data.data.posts.length).fill(false));
      setPosts(response.data.data.posts);
      console.log(response.data.data.posts);
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  const handleLinkClick = (index) => {
    // Set loading state for the clicked post to true
    setLoadingStates((prevStates) => prevStates.map((state, i) => (i == index ? true : state)));
  };

  return (
    <>
      <h1 id='header-text'>Daily Devotion List</h1>
      <div className='general-box'>
        {Array.isArray(posts) &&
          posts.map((post, index) => (
            <div key={post.id} id='post-container'>
              {/* Thumbnail */}
              <div className='image-box'>
                <img src={`${config.BASE_URL}/devotion_thumbnail/${post.imageName}`} alt={`Thumbnail for ${post.imageName}`} />
              </div>

              {/* Topic */}
              <h1 className='font-bold'>{post.topic}</h1>

              {/* Text */}
              <div id='maya' dangerouslySetInnerHTML={{ __html: post.text }} />

              {/* Audio */}
              <audio style={{ width: '100%', height: '50px' }} controls className='mb-2'>
                <source src={`${config.BASE_URL}/devotion_audio/${post.audioName}`} type='audio/mp3' />
                Your browser does not support the audio element.
              </audio>

              {/* Date */}
              <p className='text-xs'>{post.date}</p>

              {/* Update Button */}
              {!loadingStates[index] && (
                <Link
                  id='bottom-button'
                  onClick={() => handleLinkClick(index)}
                  to={`/update-devotion/${post.id}`} // Adjust the 'to' prop based on your React Router setup
                  style={{ textAlign: 'center' }}
                  className='button text-white py-2 px-4 rounded cursor-pointer'
                >
                  Update
                </Link>
              )}
              {loadingStates[index] && <p style={{ textAlign: 'center', padding: '5px 0px' }}>Loading...</p>}
            </div>
          ))}
      </div>
    </>
  );
};

export default UpdateList;
