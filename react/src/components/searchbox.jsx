import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CustomDateInput = ({ value, onClick, placeholderText }) => (
  <input
    value={value}
    readOnly
    placeholder={placeholderText}
    onClick={onClick}
    id='date-pick'
  />
);

const SearchBox = () => {
  const [date, setDate] = useState('');
  const [dates, setDates] = useState(null);

  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setDates(date);
    if (date) {
      const formattedDate = format(date, 'MMM dd, yyyy');
      setDate(formattedDate);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (date == '') {
      alert('Please select a date');
    } else {
        navigate(`/find-devotion-by-date/${date}`);
    }
  };

  return (
    <form className="max-w-6xl mx-auto flex justify-center items-center px-5">
      <div id='datepicker'>
        <DatePicker
          id='date-pick'
          selected={dates}
          onChange={handleDateChange}
          dateFormat="MMM d, yyyy"
          showYearDropdown
          yearDropdownItemNumber={40}
          scrollableYearDropdown
          showMonthDropdown
          customInput={<CustomDateInput placeholderText="Click here to select date!" />}
        />
      </div>

      <button id='datepicker-search-button' onClick={handleSearch} className="button text-white-400">
        Search
      </button>
    </form>
  );
}

export default SearchBox;
