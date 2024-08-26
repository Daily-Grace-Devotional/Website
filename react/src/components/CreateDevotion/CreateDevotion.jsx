import React, { useState, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { format, parse } from 'date-fns';
import { CREATE_POST_MUTATION } from '../GraphqlMutations/createMutation';
import { print } from 'graphql';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

const CreateDevotion = () => {
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
  const [creating, setCreating] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      [{'align': []}],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align', 'align-center', 'align-right', 'align-justify',
  ];

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
      setAudioName(file.name);
      setAudioPrelisten(URL.createObjectURL(file));
    }
    console.log(audioPrelisten);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result.toString() || '');
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

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (topic != '') {
      try {
        setCreating(true);
        const data = { topic, text, audioName, imageName, date };
        const response = await axios.post(`${config.API_URL}/graphql-server`, {
          query: print(CREATE_POST_MUTATION),
          variables: {
            postInput: data,
          },
        });

        console.log(response);

        if (response.data.data.createPost != null) {
          if (audio != null) {
            const audioRecord = new FormData();
            audioRecord.append('audio', audio);
            await axios.post(`${config.API_URL}/sendAudio`, audioRecord).then((sendAudio) => {
              console.log(sendAudio.data);
            }).catch(e => {
              alert('Devotion created, but audio is not saved.');
            });
          }

          if (thumbnail != null) {
            const imageThumbnail = new FormData();
            imageThumbnail.append('thumbnail', thumbnail);
            await axios.post(`${config.API_URL}/sendThumbnail`, imageThumbnail).then((sendThumbnail) => {
              console.log(sendThumbnail.data);
            }).catch(e => {
              alert('Devotion created, but thumbnail is not saved.');
            });
          }
          alert('Devotion created successfully');
        } else if (response.data.data.createPost == null) {
          alert('Error creating devotion. Please Try again later.');
        }
      } catch (error) {
        console.error('Error creating devotion:', error);
      } finally {
        setCreating(false);
      }
    } else {
      alert('Please enter at least the topic');
    }
  };

  return (
    <div className="post-container">
      <h2>Add a New Devotion</h2>

      <div className="form-group">
        <label htmlFor="topic" className="block">Enter Topic:</label>
        <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full border p-2 mt-1" required />
      </div>

      <div style={{ margin: '30px 0px 70px 0px' }} className="form-group">
        <label htmlFor="text" className="block">Enter Message:</label>
        <ReactQuill
          style={{ height: '200px' }}
          theme="snow"
          value={text}
          onChange={(value) => setText(value)}
          modules={modules}
          formats={formats}
          className="w-full mt-1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="audio" className="block">Choose Audio: <span style={{ fontSize: '14px' }}>(Audio Supported - MP3 only.*)</span></label>
        <input id="audio" type="file" accept="audio/*" onChange={handleAudioChange} className="mt-1" />
      </div>

      {audioPrelisten && (
        <div style={{ marginTop: '10px' }}>
          <audio controls>
            <source src={audioPrelisten} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      <div style={{ marginTop: '30px' }} className="form-group">
        <label htmlFor='image' className="block">Choose Thumbnail: <span style={{ fontSize: '14px' }}>(Image Supported*)</span></label>
        <input id='image' type="file" accept="image/*" onChange={handleThumbnailChange} className="mt-1" />
      </div>

      {thumbnailPreview && (
        <div style={{ width: '200px', height: '200px', marginTop: '10px' }}>
          <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      <div id='date-picker' style={{margin: '30px 0px', padding: '0px'}}>
        <label htmlFor='date-pick' className="block">Please Click Below To Select date</label>
        <DatePicker
          id='date-pick'
          selected={dates}
          onChange={handleDateChange}
          dateFormat="MMM d, yyyy"
          showYearDropdown
          yearDropdownItemNumber={40}
          scrollableYearDropdown
          showMonthDropdown
          customInput={<CustomDateInput placeholderText="MMM d, yyyy" />}
        />
      </div>

      {!creating && <button type="submit" onClick={handleCreatePost} className="button text-white py-2 px-4 rounded focus:outline-none mt-4">
        Create Devotion
      </button>}
      {creating && <p>Creating devotion...</p>}
    </div>
  );
};

export default CreateDevotion;
