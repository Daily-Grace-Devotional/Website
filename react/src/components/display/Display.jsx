import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import config from "../../config";



const Display = () => {
  const [postId, setPostId] = useState('');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [imageName, setImageName] = useState('');
  const [audioName, setAudioName] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devotionAvailable, setDevotionAvailable] = useState(true);

  const {id} = useParams();

  useEffect(() => {
    // Fetch post data when component mounts
    getPostData();
  }, [id]);

  const getPostData = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/graphql-server`, {
        query: `
          query Post($id: ID!) {
            post(id: $id) {
              id
              topic
              text
              audioName
              imageName
              date
            }
          }
        `,
        variables: { id: id },
      });

      const postData = response.data.data.post;

      if (!postData) {
        setDevotionAvailable(false);
        return;
      }

      console.log(response.data.data.post);
      setPostId(postData.id);
      setTopic(postData.topic);
      setText(postData.text);
      setAudioName(postData.audioName);
      setImageName(postData.imageName);
      setDate(postData.date);
      setIsLoading(true);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  if (!devotionAvailable) {
    return (
      <div className="todays-devotion-container" style={{ width: '100%', textAlign: 'center' }}>
        Sorry. No devotion available for today...
      </div>
    );
  }

  return (
    <>
      <div id="todaysDevotion" className="todays-devotion-container">
        {/* <Head>
          <title>{topic}</title>
        </Head> */}
        <div style={{ width: '100%', margin: '20px 0px' }}>
          <Link to={'/general-devotion'} style={{ textAlign: 'center', padding: '10px' }} className="button text-white py-2 px-4 rounded cursor-pointer">&#x2190; Go Back</Link>
        </div>
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
      </div>
    </>
  );
};

export default Display;
