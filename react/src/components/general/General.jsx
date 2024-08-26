import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Make sure to use the appropriate Link component for your routing library
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import config from "../../config";


const General = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewAllLoading, setViewAllLoading] = useState(false);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/graphql-server`, {
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
      });

      const fetchedData = response.data.data.posts;
      setData(fetchedData);

      // Dynamically set slidesToShow based on the number of items
      if (Array.isArray(fetchedData) && fetchedData.length < 3) {
        settings.slidesToShow = fetchedData.length;
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div id='general' className='general-container'>
      <h1>Other Devotions</h1>
      <Slider {...settings}>
        {Array.isArray(data) && data.map((devotion) => (
          <div id='post-contain' key={devotion.id}>
            <h1>{devotion.topic}</h1>
            <div className='image-box'>
              <img
                src={`${config.BASE_URL}/devotion_thumbnail/${devotion.imageName}`}
                alt={`Thumbnail for ${devotion.topic}`}
              />
            </div>
            <div id='maya' dangerouslySetInnerHTML={{ __html: devotion.text }} />
            <p style={{marginBottom: '5px'}} className="text-xs">{devotion.date}</p>
            {!loading && <Link onClick={() => setLoading(true)} id='bottom-button' to={`/display/${devotion.id}`} style={{textAlign: 'center'}} className="button text-white py-2 px-4 rounded cursor-pointer">
              View More
            </Link>}
            {loading && <p>Loading...</p>}
          </div>
        ))}
      </Slider>
      <div className='button-container'>
        {!viewAllLoading && <a onClick={() => setViewAllLoading(true)} href='/generalDevotion' className='button margin-30 text-white font-bold py-2 px-4 rounded cursor-pointer'>
          View All
        </a>}
      </div>
      {viewAllLoading && <p style={{textAlign: 'center'}}>Loading...</p>}
    </div>
  );
};

export default General;
