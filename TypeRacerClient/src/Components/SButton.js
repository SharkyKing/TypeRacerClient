// src/components/SButton.js

import React from 'react';
import './SButton.css'; // Import styles

const SButton = ({ onClick, disabled = false, style = {}, className = "", children, isActive = false }) => {
    return (
        <button
            className={`s-button ${className} ${isActive ? 'activebtn' : ''}`}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {children} {/* Render children here */}
        </button>
    );
};

export default SButton;
