import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import {useParams} from 'react-router-dom';


const SearchByDate = () => {
  const [postId, setPostId] = useState('');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [imageName, setImageName] = useState('');
  const [audioName, setAudioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devotionAvailable, setDevotionAvailable] = useState(true);

  const {date} = useParams();
  // const segments = window.location.pathname;
  // const path = segments.split("/")[2]; // Get the part after the domain

  // // Decode the URI component to get the actual date string
  // const decodedPath = decodeURIComponent(path);

  useEffect(() => {
    // Fetch post data when component mounts
    getPostData();
  }, [date, topic]);

  const getPostData = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/graphql-server`, {
        query: `
          query GetPostByDate($date: String!) {
            getPostByDate(date: $date) {
              id
              topic
              text
              audioName
              imageName
              date
            }
          }
        `,
        variables: { date: date },
      });

      const postData = response.data.data.getPostByDate;
      if (postData == undefined) {
        setDevotionAvailable(false);
      }
      console.log(response.data.data.getPostByDate);
      setPostId(postData.id);
      setTopic(postData.topic);
      setText(postData.text);
      setAudioName(postData.audioName);
      setImageName(postData.imageName);
      setIsLoading(true);
      setDevotionAvailable(true);
    } catch (error) {
      console.error('Error fetching post data:', error);
    } finally {
      window.location.reload;
    }
  };

  if (!devotionAvailable) {
    return (
      <>
        <div className="todays-devotion-container" style={{ width: '100%', textAlign: 'center' }}>Sorry. No devotion available today...</div>
      </>
    );
  }

  return (
    <>
      <div id="todaysDevotion" className="todays-devotion-container">
        <h2><b>Topic:</b> {topic}</h2>
        <div className="image-container">
          <img src={`${config.BASE_URL}/devotion_thumbnail/${imageName}`} alt={`Thumbnail for ${imageName}`} />
        </div>

        {isLoading &&
          <audio style={{ marginTop: '30px' }} controls>
            <source src={`${config.BASE_URL}/devotion_audio/${audioName}`} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        }

        <p style={{ marginTop: '20px' }}><b>Message:</b></p>
        <div id="message">
          <p style={{ padding: '20px', width: '100%', whiteSpace: 'pre-wrap', wordWrap: 'break-word', flex: 1, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: text }} />
        </div>

        <p style={{ margin: '10px 0px', color: '#ccc' }} className="text-xs text-gray-500">Date: {date}</p>

        {/* <button style={{ marginTop: '0px' }} type="submit" className="button text-white py-2 px-4 rounded focus:outline-none mt-4">
          View More
        </button> */}
      </div>
    </>
  );
};

export default SearchByDate;
