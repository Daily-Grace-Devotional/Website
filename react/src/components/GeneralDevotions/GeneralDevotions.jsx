import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from "../../config";


const GeneralDevotion = () => {
  const [posts, setPosts] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    try {
      const response = await axios.post(
        `${config.API_URL}/graphql-server`,
        {
          query: `
            query GetAllPosts {
                posts {
                id
                topic
                text
                audioName
                imageName
                date
              }
            }
          `,
        }
      );

      setLoadingStates(new Array(response.data.data.posts.length).fill(false));
      setPosts(response.data.data.posts);
      console.log(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  const handleLinkClick = (index) => {
    setLoadingStates((prevStates) =>
      prevStates.map((state, i) => (i == index ? true : state))
    );
  };

  return (
    <>
      <h1 id='header-text'>General Devotion</h1>
      <div className='general-box'>
        {Array.isArray(posts) &&
          posts.map((post, index) => (
            <div key={post.id} id='post-container'>
              <div className='image-box'>
                <img
                  src={`${config.BASE_URL}/devotion_thumbnail/${post.imageName}`}
                  alt={`Thumbnail for ${post.topic}`}
                />
              </div>

              {/* Topic */}
              <h1 className='text-xl font-bold'>{post.topic}</h1>

              {/* Text */}
              <div
                id='maya'
                dangerouslySetInnerHTML={{ __html: post.text }}
              />

              {/* Audio */}
              <audio
                style={{ width: '100%', height: '50px' }}
                controls
                className='mb-2'
              >
                <source
                  src={`${config.BASE_URL}/devotion_audio/${post.audioName}`}
                  type='audio/mp3'
                />
                Your browser does not support the audio element.
              </audio>

              {/* Date */}
              <p className='text-xs text-gray-500'>{post.date}</p>

              {/* View More Button */}
              {!loadingStates[index] && (
                <Link
                  id='bottom-button'
                  onClick={() => handleLinkClick(index)}
                  to={`/display/${post.id}`}
                  style={{ textAlign: 'center' }}
                  className='button text-white py-2 px-4 rounded cursor-pointer'
                >
                  View More
                </Link>
              )}
              {loadingStates[index] && (
                <p style={{ textAlign: 'center', padding: '5px 0px' }}>
                  Loading...
                </p>
              )}
            </div>
          ))}
      </div>
      {/* Add your Footer component here */}
    </>
  );
};

export default GeneralDevotion;
