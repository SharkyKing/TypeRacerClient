// src/modules/SInput.js

import React, { forwardRef } from 'react';
import './SInput.css'; // Import styles

const SInput = forwardRef(({ value, readOnly = false, onChange, placeholder = "", disabled = false, style = {}, className = "", onKeyDown }, ref) => {
    return (
        <input
            type="text"
            value={value}
            onKeyDown={onKeyDown}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`s-input ${className}`}
            style={style}
            readOnly={readOnly}
            ref={ref} // Set the ref here
        />
    );
});

export default SInput;
