// Modal.js

import React from 'react';
import './modal-form.css';

const ModalForm = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={onClose}>&times;</span>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalForm;
