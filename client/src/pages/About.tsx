import { useNavigate } from "react-router-dom";
import { api } from "../api/url";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { type User } from "../lib/types";

function About() {
  const navigate = useNavigate()
  const { setAccessToken } = useAuth();
  const [user, setUsers] = useState<User[]>([])

  useEffect(() => {
    getUser()
  }, [])

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // cookie auto sent
    } catch (err) {
      console.log("Logout error", err);
    } finally {
      setAccessToken(null);      // clear memory
      navigate('/login')
    }
  }

  async function getUser() {

    try {
      const res = await api.get('/user')
      setUsers(res.data)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="h-full p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">About This App</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {user.map((user, index) => (
          <div
            key={user._id}
            className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-2xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                User #{index + 1}
              </h2>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-500">ID:</p>
              <p className="text-sm font-medium text-gray-800 wrap-break-word">
                {user._id}
              </p>

              <p className="text-sm text-gray-500 mt-3">Username:</p>
              <p className="text-base font-semibold text-gray-900">
                {user.username}
              </p>

              <p className="text-sm text-gray-500 mt-3">Email:</p>
              <p className="text-base text-gray-700">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </section>

      <button
        className="mt-8 p-3 bg-amber-400 hover:bg-amber-500 rounded-lg transition"
        onClick={logout}
      >
        LOGOUT
      </button>
    </div>

  );
}

export default About;
