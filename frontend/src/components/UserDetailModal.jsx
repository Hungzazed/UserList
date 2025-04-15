import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const UserDetailModal = ({ user = null, onClose, show, isEdit = false,  }) => {

  const { addUser, updateUser, numberOfUsers } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    companyName: '',
    city: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));  
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEdit && user) {
    
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        company: {
          name: formData.companyName
        },
        address: {
          city: formData.city,
        }
      };
      updateUser(updatedUser);
    } else if (!user) {
      const newUser = {
        id: numberOfUsers + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        company: {
          name: formData.companyName
        },
        address: {
          city: formData.city,
        }
      };
      addUser(newUser);
    }
    onClose();
  };

  useEffect(() => {
    if (show) {
      if (isEdit && user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          website: user.website || '',
          companyName: user.company?.name || '',
          city: user.address?.city || ''
        });
      }
    }
  }, [show, user, isEdit]);

  const isViewMode = user && !isEdit;
  const isAddingMode = !user;
  const isEditingMode = user && isEdit;

  return (
    <Modal
      show={show}
      onHide={onClose} 
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        {isEditingMode ? (
            <span className="fw-bold text-warning">Chỉnh sửa: {user.name}</span>
          ) : isAddingMode ? (
            <span className="fw-bold">Thêm người dùng mới</span>
          ) : (
            <span className="fw-bold text-primary">{user.name}</span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isViewMode ? (
          <div>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> {user.website}</p>
            <p><strong>Company:</strong> {user.company?.name || 'N/A'}</p>
            <p><strong>City:</strong> {user.address?.city || 'N/A'}</p>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Nhập email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="tel" placeholder="Nhập số điện thoại" name="phone" value={formData.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserWebsite">
              <Form.Label>Website</Form.Label>
              <Form.Control type="text" placeholder="Nhập website (ví dụ: example.com)" name="website" value={formData.website} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserCompany">
              <Form.Label>Tên công ty</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên công ty" name="companyName" value={formData.companyName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserCity">
              <Form.Label>Thành phố</Form.Label>
              <Form.Control type="text" placeholder="Nhập thành phố" name="city" value={formData.city} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        {(isAddingMode || isEditingMode) && (
          <Button variant={isEditingMode ? "warning" : "primary"} onClick={handleSubmit}>
            Lưu
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;