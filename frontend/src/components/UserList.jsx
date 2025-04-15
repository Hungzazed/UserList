import { useState, useContext, useMemo } from "react";
import { UserContext } from "../context/UserContext";
import UserDetails from "./UserDetail";
import { Button, Dropdown } from "react-bootstrap";

const UserList = () => {
  const { users, loading, deleteUser } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShowModal] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");
  const usersPerPage = 5;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setEdit(false);
  };

  const uniqueCompanies = useMemo(() => {
    if (!users || users.length === 0) {
      return [];
    }
    const companyNames = users
      .map((user) => user.address?.city)
      .filter((name) => name);
    return [...new Set(companyNames)].sort();
  }, [users]);

  const handleCompanySelect = (companyName) => {
    setSelectedCity(companyName || "");
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = !search || user.name.toLowerCase().includes(search.toLowerCase());
      const companyMatch = !selectedCity || user.address?.city === selectedCity;
      return nameMatch && companyMatch;
    });
  }, [users, search, selectedCity]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="form-control me-2"
          value={search}
          onChange={handleSearchChange}
        />
        <Dropdown onSelect={handleCompanySelect}>
          <Dropdown.Toggle
            variant={selectedCity ? "secondary" : "outline-secondary"}
            id="company-filter-dropdown"
            className="flex-shrink-0 text-truncate"
            style={{ maxWidth: "200px" }}>
              Lọc
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
            <Dropdown.Item eventKey="" active={!selectedCity}>
              Tất cả thành phố
            </Dropdown.Item>
            <Dropdown.Divider />
            {uniqueCompanies.map((companyName) => (
              <Dropdown.Item
                key={companyName}
                eventKey={companyName}
                active={selectedCity === companyName}>
                {companyName}
              </Dropdown.Item>
            ))}
            {uniqueCompanies.length === 0 && (
              <Dropdown.Item disabled>Không có dữ liệu thành phố</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Button
        variant="primary"
        onClick={() => {
          setSelectedUser(null);
          handleShowModal();
        }}
        className="mb-4">
        Thêm người dùng
      </Button>

      {loading && (
        <div className="d-flex justify-content-center text-muted my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <span className="ms-2">Đang tải dữ liệu...</span>
        </div>
      )}
      {!loading && (
        <>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted">
              Không tìm thấy người dùng nào.
            </p>
          ) : (
            <>
              <ul className="list-group shadow-sm mb-4">
                {currentUsers.map((user) => (
                  <li
                    key={user.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setSelectedUser(user);
                      handleShowModal();
                    }}>
                    <div>
                      <h5
                        className="mb-1 fw-bold"
                        style={{ cursor: "pointer", display: "inline-block" }}>
                        {user.name}
                      </h5>
                      <p className="mb-1 text-muted">Email: {user.email}</p>
                      <small className="text-muted">
                        City: {user.address?.city || "N/A"}
                      </small>
                    </div>
                    <div>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          setEdit(true);
                          handleShowModal();
                        }}>
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
                            deleteUser(user._id);
                          }
                        }}>
                        Xóa
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <nav aria-label="User pagination">
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          currentPage === pageNumber ? "active" : ""
                        }`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(pageNumber)}>
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </>
          )}
        </>
      )}
      {show && (
        <UserDetails
          user={selectedUser}
          show={show}
          onClose={handleCloseModal}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default UserList;
