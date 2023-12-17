// Modal.js

import React from 'react';
import './modal-form-edit.css';

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div className="modal-overlay-new" onClick={onClose}>
                    <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
                        <span className="close-new" onClick={onClose}>&times;</span>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
