import React from 'react';

const SendFetchedDataButton: React.FC = () => {
    const handleClick = () => {
        // Function to handle button click
        console.log('Button clicked!');
    };

    return (
        <button onClick={handleClick}>
            Send Fetched Data
        </button>
    );
};

export default SendFetchedDataButton;