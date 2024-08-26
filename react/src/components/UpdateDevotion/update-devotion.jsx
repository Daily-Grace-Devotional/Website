import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import {useParams} from 'react-router-dom';
import { print } from 'graphql';
import { UPDATE_POST_MUTATION } from '../GraphqlMutations/updateMutation';
import config from "../../config";


const CustomDateInput = ({ value, onClick, placeholderText }) => (
  <input
    value={value}
    readOnly
    placeholder={placeholderText}
    onClick={onClick}
    id='date-pick'
  />
);

const UpdateDevotion = () => {
  const [postId, setPostId] = useState('');
  const [topic, setTopic] = useState('');
  const [text, setText] = useState('');
  const [audioName, setAudioName] = useState('');
  const [audio, setAudio] = useState(null);
  const [imageName, setImageName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [audioPrelisten, setAudioPrelisten] = useState(undefined);
  const [thumbnailPreview, setThumbnailPreview] = useState(undefined);

  const [date, setDate] = useState('');
  const [dates, setDates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {id} = useParams();

  useEffect(() => {
    getPostData();
  }, []);

  const getPostData = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/graphql-server`, {
        query: `
          query GetPost($postId: ID!) {
            post(id: $postId) {
              id
              topic
              text
              audioName
              imageName
              date
            }
          }
        `,
        variables: {
          postId: id, // Replace with the actual post ID
        },
      });

      const postData = response.data.data.post;
      setPostId(postData.id);
      setTopic(postData.topic);
      setText(postData.text);
      setAudioName(postData.audioName);
      setImageName(postData.imageName);
      const convertedDate = new Date(postData.date);
      postData.date != '' ? setDates(convertedDate) : setDates(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post data:', error);
      setLoading(false);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setAudio(file);
      setAudioName(file.name);
      setAudioPrelisten(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setThumbnail(file);
      setImageName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e?.target?.result?.toString() || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (date) => {
    setDates(date);
    if (date) {
      const formattedDate = format(date, 'MMM dd, yyyy');
      setDate(formattedDate);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (topic != '' || audioName != '' || imageName != '') {
      try {
        setUpdating(true);
        const data = { postId, topic, text, audioName, imageName, date };
        const response = await axios.post(`${config.API_URL}/graphql-server`, {
          query: print(UPDATE_POST_MUTATION),
          variables: {
            postId: id,
            postInput: data,
          },
        });

        if (response.status == 200) {
          if (audio != null) {
            const audioRecord = new FormData();
            audioRecord.append('audio', audio);
            await axios.post(`${config.API_URL}/sendAudio`, audioRecord).then((sendAudio) => {
              console.log(sendAudio.data);
            });
          }

          if (thumbnail != null) {
            const imageThumbnail = new FormData();
            imageThumbnail.append('thumbnail', thumbnail);
            await axios.post(`${config.API_URL}/sendThumbnail`, imageThumbnail).then((sendThumbnail) => {
              console.log(sendThumbnail.data);
            });
          }
          alert('Devotion updated successfully');
          setUpdating(false);
        } else if (response.status == 400) {
          alert('Error updating devotion. Please try again later.');
          setUpdating(false);
        }
      } catch (error) {
        alert('Error updating devotion. Please try again later.');
        setUpdating(false);
        console.error('Error updating devotion:', error);
      }
    } else {
      alert('Please enter the topic.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='post-container'>
      <h2>Update {topic}</h2>

      <div className='form-group'>
        <label htmlFor='topic' className='block'>
          Enter Topic:
        </label>
        <input
          id='topic'
          type='text'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className='w-full border p-2 mt-1'
          required
        />
      </div>

      <div style={{ margin: '30px 0px 70px 0px' }} className='form-group'>
        <label htmlFor='text' className='block'>
          Enter Message:
        </label>
        <ReactQuill
          style={{ height: '200px' }}
          theme='snow'
          value={text}
          onChange={(value) => setText(value)}
          modules={{ toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'], [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], ['link', 'image'], [{ 'align': [] }], ['clean']] }}
          formats={['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'align', 'align-center', 'align-right', 'align-justify']}
          className='w-full mt-1'
        />
      </div>

      <div className='form-group'>
        <label htmlFor='audio' className='block'>
          Change Audio: <span style={{ fontSize: '14px' }}>(Audio Supported - MP3 only.*)</span>
        </label>
        <input id='audio' type='file' accept='audio/*' onChange={handleAudioChange} className='mt-1' />
      </div>

      <div style={{ marginTop: '10px' }}>
        <audio controls>
          <source src={audioPrelisten || (process.env.PUBLIC_URL + `/devotion_audio/${audioName}`)} type='audio/mp3' />
          Your browser does not support the audio tag.
        </audio>
      </div>

      <div style={{ marginTop: '30px' }} className='form-group'>
        <label htmlFor='image' className='block'>
          Change Thumbnail: <span style={{ fontSize: '14px' }}>(Image Supported*)</span>
        </label>
        <input id='image' type='file' accept='image/*' onChange={handleThumbnailChange} className='mt-1' />
      </div>

      <div style={{ width: '200px', height: '200px', marginTop: '10px' }}>
        <img src={thumbnailPreview == undefined ? (process.env.PUBLIC_URL + `/devotion_thumbnail/${imageName}`) : thumbnailPreview} alt='Thumbnail Preview' style={{ width: '100%', height: '100%' }} />
      </div>

      <div id='date-picker' style={{margin: '30px 0px', padding: '0px'}}>
        <label htmlFor='date-pick' className='block'>
          Click Below To Update Date
        </label>
        <DatePicker
          id='date-pick'
          selected={dates}
          onChange={handleDateChange}
          dateFormat='MMM d, yyyy'
          showYearDropdown
          yearDropdownItemNumber={40}
          scrollableYearDropdown
          showMonthDropdown
          customInput={<CustomDateInput placeholderText='MMM d, yyyy' />}
        />
      </div>

      {!updating && (
        <button type='submit' onClick={handleUpdatePost} className='button text-white py-2 px-4 rounded focus:outline-none mt-4'>
          Update Devotion
        </button>
      )}
      {updating && <p>Updating devotion...</p>}
    </div>
  );
};

export default UpdateDevotion;
