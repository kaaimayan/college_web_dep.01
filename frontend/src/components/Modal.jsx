import React from 'react';
import { Modal as BSModal } from 'react-bootstrap';

const Modal = ({ show, onHide, title, children, footerActions, size = 'md' }) => {
  return (
    <BSModal
      show={show}
      onHide={onHide}
      size={size}
      centered
      contentClassName="glass-card text-white border-0 shadow-lg"
    >
      <BSModal.Header closeButton closeVariant="white" className="border-bottom border-secondary pb-3">
        <BSModal.Title className="fs-5 fw-bold text-warning">{title}</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body className="py-4">
        {children}
      </BSModal.Body>
      {footerActions && (
        <BSModal.Footer className="border-top border-secondary pt-3">
          {footerActions}
        </BSModal.Footer>
      )}
    </BSModal>
  );
};

export default Modal;
