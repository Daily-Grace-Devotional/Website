import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaFacebook, FaLinkedin, FaPaperPlane, FaPhone, FaYoutube } from 'react-icons/fa';
import config from "../config";
import { Subscribe } from './GraphqlMutations/subscribeMutation';


const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const subscribe = async (e) => {
        e.preventDefault();
        if (email !== '') {
            if (email.includes('@')) {
                setLoading(true);
                const data = { email: email };
                try {
                    const response = await axios.post(`${config.API_URL}/graphql-server`, {
                        query: Subscribe?.loc?.source.body,
                        variables: { emailSubscription: data }
                    });

                    if (response.data.data.subscribe.email !== 'Duplicate email.') {
                        alert('Email successfully saved.');
                        setLoading(false);
                    } else if (response.data.data.subscribe.email === 'Duplicate email.') {
                        alert('Email already exists.');
                        setLoading(false);
                    } else {
                        alert('An error occurred while saving email. Please try again later.');
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error subscribing:', error);
                    alert('An error occurred while subscribing. Please try again later.');
                    setLoading(false);
                }
            } else {
                alert('Invalid email. Please check your email and try again.');
            }
        } else {
            alert('Please Enter Your Email Here.');
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <footer className="footer-container text-white py-8">
                <div id='contact-details' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    <div className="flex items-center">
                        <FaEnvelope size={20} className="text-white-500 mr-2" /> &nbsp;
                        <p><a href='mailto:dailygracedevotional0@gmail.com'><b>Email:</b> dailygracedevotional0@gmail.com</a></p>
                    </div>

                    <div className='flex items-center'>
                        <FaPhone size={20} className="text-white-500 mb-2" /> &nbsp; &nbsp;
                        <p><b>Phone:</b> +(234) 816 856 4675</p>
                    </div>

                    <div className="flex items-center"><b>Socials:</b> &nbsp;&nbsp;
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={20} />
                        </a>&nbsp;&nbsp;
                        <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
                            <FaYoutube size={20} />
                        </a>&nbsp;&nbsp;
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <h2 className="text-lg font-semibold mb-4">Subscribe to our Newsletter</h2>
                    <div className="flex items-center justify-center">
                        <input
                            style={{ height: '42px' }}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="border border-gray-600 py-2 px-4 rounded-l focus:outline-none focus:border-orange-500"
                        />
                        {!loading && <button
                            onClick={subscribe}
                            style={{ minWidth: "140px", borderRadius: '0px', height: '42px' }}
                            className="button text-white py-2 px-4 focus:outline-none flex items-center"
                        >
                            <FaPaperPlane size={20} className="mr-2" />Subscribe
                        </button>}
                        {loading && <p>&nbsp; Loading...</p>}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p>Grace of God Mission International &copy; {new Date().getFullYear()} <a href='https://dailygracedevotional.org' style={{ color: '#eca366' }}>dailygracedevotional.org</a>. All rights reserved.</p>
                    <div className="mt-4">
                        <a href="/" className="text-gray-300 hover:underline mx-2">Home</a>|
                        <a href="/about" className="text-gray-300 hover:underline mx-2">About</a>|
                        <a href="/terms&conditions" className="text-gray-300 hover:underline mx-2">Terms and Conditions</a>|
                        <a href="/privacypolicy" className="text-gray-300 hover:underline mx-2">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
