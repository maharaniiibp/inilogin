import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading.jsx";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://fakestoreapi.com/users?page=${page}`
      );
      const { data, headers } = response;
      setUsers(data);
      setTotalPages(parseInt(headers["x-total-pages"]));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleDeleteUser = async (id) => {
    try {
        const confirmDelete = window.confirm('Apakah kamu akan menghapus?');
  if (confirmDelete) {
      await axios.delete(`https://fakestoreapi.com/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container p-2 mx-auto sm:p-4 text-black">
      <h2 className="mb-4 text-2xl font-semibold text-center">User </h2>
      <div className="overflow-x-auto">
        {users.length > 0 ? (
          <table className="min-w-full text-xs">
            <thead className="bg-gray-300">
              <tr className="md:text-left text-center">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="md:text-left text-center">
              {users.map((user) => (
                <tr
                  className="border-b border-opacity-20 border-gray-300 bg-gray-50"
                  key={user.id}
                >
                  <td className="p-3">
                    <p>{user.id}</p>
                  </td>
                  <td className="p-3 capitalize">
                    <p>{`${user.name.firstname} ${user.name.lastname}`}</p>
                  </td>
                  <td className="p-3">
                    <p>{user.email}</p>
                  </td>
                  <td className="p-3">
                    <button
                      className="px-8 py-3 font-semibold rounded bg-greeen text-black"
                      onClick={() => handleViewUser(user)}
                    >
                      Lihat
                    </button>
                    <button
                      className="px-7 py-3 font-semibold rounded bg-red text-black ml-4"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                     Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          Loading
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 ">
              <h2 className="text-xl font-bold mb-4">User Detail</h2>
              {selectedUser ? (
                <div>
                  <p>ID: {selectedUser.id}</p>
                  <p className="capitalize">
                    Name:{" "}
                    {`${selectedUser.name.firstname} ${selectedUser.name.lastname}`}
                  </p>
                  <p>Email: {selectedUser.email}</p>
                  <p>Username: {selectedUser.username}</p>
                  <p>Phone: {selectedUser.phone}</p>
                  <p>
                    Address: {`${selectedUser.address.street}`} No{" "}
                    {`${selectedUser.address.number} ${selectedUser.address.city} ${selectedUser.address.zipcode}`}
                  </p>
                </div>
              ) : (
                <p>No user selected.</p>
              )}
              <div className="mt-4">
                <button
                  className="bg-white text-black py-2 px-4 mr-2 "
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;