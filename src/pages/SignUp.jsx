// import Navbar from "../components/Navbar";
import PasswordInput from "../components/Cards/PasswordInput";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      const response = await axiosInstance.post("/signup", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again!");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-32">
        <div className="border bg-white w-96 px-7 py-10 rounded-3xl border-emerald-400">
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl mb-7 text-center font-medium">SignUp</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box border border-emerald-400 rounded-3xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box border border-emerald-400 rounded-3xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium underline text-emerald-400 hover:text-emerald-600"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
