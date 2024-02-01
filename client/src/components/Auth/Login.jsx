import React, { useContext, useEffect, useState, CSSProperties } from "react";
import { Link } from "react-router-dom";

import { Icon } from "@iconify/react";
import PulseLoader from "react-spinners/PulseLoader";

///////

import { makeUnauthenticatedPOSTRequest } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { showErrorToast } from "../App/error/ShowToast";

function Login() {
  const override = {
    display: "block",
    position: "absolute",
    margin: "0 auto",
    transform: "translate(47vw,40vh)",
    borderColor: "green",
  };

  ///auth
  const { login } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["token", "email"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(function checkAuth() {
      if (cookies.token) {
        // already logged in
        navigate("/");
      }
      setLoading(false);
    }, 1000);
  }, [cookies.token]);

  const [enabled, setEnabled] = useState(true);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleloginInput = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "user") {
      setUser(e.target.value);
    }
  };

  const loginUser = async () => {
    // console.log(`${user}: ${password}`);
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if the password matches the regex pattern
    if (!password.match(passwordRegex)) {
      showErrorToast(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
      );
      return;
    }
    const userdata = {
      email: user,
      password: password,
    };

    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/login",
      userdata
    );

    if (response && !response.err) {
      const token = response.user.token;
      const userData = response.user;

      login(token, userData);
      toast.success("Login Successfully!!");
      navigate("/");
    } else {
      toast.error(response.err);
    }
  };
  return loading ? (
    <div
      className="h-[100vh]"
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 23%, rgba(43,43,43,1) 100%, rgba(126,126,126,1) 100%, rgba(0,0,0,1) 100%, rgba(6,6,6,1) 100%, rgba(112,108,108,1) 100%, rgba(75,72,72,1) 100%, rgba(255,255,255,1) 100%)",
      }}
    >
      <PulseLoader color="#1db954" cssOverride={override} />
    </div>
  ) : (
    <div
      className="min-h-screen login-container"
      style={{
        background:
          "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 23%, rgba(43,43,43,1) 100%, rgba(126,126,126,1) 100%, rgba(0,0,0,1) 100%, rgba(6,6,6,1) 100%, rgba(112,108,108,1) 100%, rgba(75,72,72,1) 100%, rgba(255,255,255,1) 100%)",
      }}
    >
      <div className="login-header h-[5rem] flex items-center bg-black pl-8">
        <Icon icon="logos:spotify" className="text-white w-[120px] h-[45px]" />
      </div>

      <div className="flex items-center justify-center login-box-wrapper">
        <div className="login-input-container text-white flex flex-col justify-center items-center bg-black max-w-[800px] flex-1 rounded-lg mt-12 p-12">
          <h1 className="text-[2.8rem] font-bold mt-4 mb-8">
            Log in to Spotify
          </h1>
          <div className="max-w-[400px] relative ">
            <div>
              <label htmlFor="user" className="font-semibold">
                Email or username
              </label>
              <input
                type="text"
                name="user"
                id="user"
                autoComplete="off"
                onChange={(e) => {
                  handleloginInput(e);
                }}
                value={user}
                placeholder="Email or username"
                className="w-full outline-4 outline-white bg-[#7676762e] p-3 border-[1px] border-white rounded-md mt-2"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="Password" className="font-semibold">
                Password
              </label>
              <input
                autoComplete="off"
                type="text"
                name="password"
                id="password"
                onChange={(e) => {
                  handleloginInput(e);
                }}
                value={password}
                placeholder="Password"
                className="w-full outline-4  outline-white bg-[#7676762e] p-3 border-[1px] border-white rounded-md mt-2"
              />
            </div>

            <div className="flex mt-3">
              <label className="relative inline-flex items-center mr-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  readOnly
                />
                <div
                  onClick={() => {
                    setEnabled(!enabled);
                  }}
                  className="w-9 h-5 bg-[#616161] rounded-full peer  peer-focus:ring-green-300 peer-focus:border-2 peer-focus:border-white  peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-black after:border-black after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"
                ></div>
                <span className="ml-2 text-sm font-medium text-white">
                  Remember me
                </span>
              </label>
            </div>
            <button
              className="bg-[#1ed760] text-black font-bold w-full h-12 rounded-[2rem] mt-8 hover:scale-110"
              onClick={loginUser}
            >
              Login
            </button>
            <div className="text-center">
              <button className="mt-4 text-center underline">
                Forgot your password?
              </button>
            </div>
            <span className="h-[1px] w-full bg-[#505050] block my-8"></span>
          </div>
          <div className="text-center">
            <p className="inline-block mr-2 text-gray-200">
              Don't have an account?
            </p>
            <Link to="/signup">
              <div className="underline hover:text-[#1ed760]">
                Signup for Spotify
              </div>
            </Link>
          </div>
          <p className="text-xs mt-[4rem]">
            This site is protected by reCAPTCHA and the Google{" "}
            <a className="underline" href="">
              Privacy Policy
            </a>
            &nbsp; and{" "}
            <a className="underline" href="">
              Terms of Service
            </a>{" "}
            apply
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
