import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      });
  }, []);

  const addUser =  (user) => {
    axios
      .post("http://localhost:3000/users", { user })
      .then((response) => {
        console.log("User added:", response.data);
        setUsers((prevUsers) => [...prevUsers, response.data]);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const updateUser = (user) => {
    axios
      .put(`http://localhost:3000/users/${user._id}`, { user })
      .then((response) => {
        console.log("User updated:", response.data);
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === user._id ? response.data : u))
        );
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  }

  const deleteUser = (userId) => {
    axios
      .delete(`http://localhost:3000/users/${userId}`)
      .then(() => {
        console.log("User deleted:", userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const numberOfUsers = users.length;

  return (
    <UserContext.Provider value={{ users, loading, addUser, updateUser, deleteUser, numberOfUsers }}>
      {children}
    </UserContext.Provider>
  );
};
