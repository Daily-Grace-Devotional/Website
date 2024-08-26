import React from 'react';

const About = () => {
  return (
    <div className='about-container'>
      <h1>About Us</h1>
      <div id='about' className="flex items-center justify-center">
        {/* Image on the left */}
        <div className='go-image-container'>
          <img src={process.env.PUBLIC_URL + '/images/GO.jpg'} alt="About us image" className="w-1/2"/>
          <p style={{paddingTop: '10px'}}><b>Bishop Dr. Paul C. Nwachukwu</b> <br/>Presiding Bishop - Grace of God Mission International.</p>
        </div>

        <div id='about-text' className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4">Grace of God Mission International</h2>
          <p className="text-gray-600">
            The word of God remains the most precious and powerful acquisition of any man on earth. It is able to keep you and direct your path. Hence, God commanded Joshua, and by extension you and me, to keep the word always on our lips;
            meditating on it day and night ...(NIV: Joshua 1:8).<br/><br/>

            Daily Grace is a spirit-filled devotional material, written by inspiration to assist you in your daily Christian walk. I have subtitled it – “meeting God every morning” because of my sincere conviction that you have to start each day with God,
            before facing the challenges of the world we live in as Jesus did.<br/><br/>

            This is one of a series of Word projects of this commission. The vision is to bring the word of God in clear and acceptable form to every home” It is my desire that the effective and regular use of this Daily Grace will transform your life and equip you for the return of our Lord even in this end time.
            Be Blessed and Inspired.          
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
