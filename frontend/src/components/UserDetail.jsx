import React from 'react';
import UserDetailModal from './UserDetailModal'
const UserDetails = ({ user, onClose, show, isEdit }) => {
  if (!show) {
    return null;
  }
  return (
    <UserDetailModal
      show={show}
      onClose={onClose}
      user={user}
      isEdit={isEdit}
     />
  );
};

export default UserDetails;