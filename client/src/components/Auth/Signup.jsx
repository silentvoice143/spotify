import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Icon } from "@iconify/react";

import { showErrorToast, showSuccessToast } from "../App/error/ShowToast";
import PulseLoader from "react-spinners/PulseLoader";

///////////
import { makeUnauthenticatedPOSTRequest } from "../../utils/apiHelper";
import { AuthContext } from "../../context/AuthContext";

function Signup() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(["token", "email"]);
  const navigate = useNavigate();

  const { admin } = useParams("admin");
  const [isAdmin, setIsAdmin] = useState(false);

  /////
  const [count, setCount] = useState(0);
  const [btnclicked, setClick] = useState(false);
  const [openMonth, setopenMonth] = useState("false");

  ////=======details======////
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [month, setmonthInput] = useState("Month");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  ////======Loading=======/////
  const [Loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  useEffect(() => {
    if (admin === "admin") {
      // console.log("yes admin registration");
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
      setError("");
    }
  }, [error]);

  const increaseCount = () => {
    if (count == 0 && !email) {
      setError("Enter email");
      return;
    }
    if (count == 1) {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      // Check if the password matches the regex pattern
      if (!password.match(passwordRegex)) {
        setError(
          "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
        );
        return;
      } else {
        // Password is valid, proceed with form submission or further processing
        setError("");
      }
    }
    setCount(count + 1);
  };

  const decreaseCount = () => {
    if (count - 1 < 0) {
      return;
    } else {
      setCount(count - 1);
    }
  };
  const Changender = (e) => {
    setGender(e.target.value);
  };

  const handlesignupInput = (e) => {
    // console.log(e.target.name);
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }

    if (e.target.name === "name") {
      setName(e.target.value);
    }
  };

  const setMonth = (e) => {
    setmonthInput(e);
    setopenMonth(!openMonth);
  };

  const setClickbtn = () => {
    setClick(!btnclicked);
  };

  async function submitUser() {
    setLoading(true);
    const user = {
      name: name,
      email: email,
      username: email,
      password: password,
      dob: `${date}/${month}/${year}`,
      gender: gender,
      isAdmin: isAdmin,
    };

    // console.log(user);

    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/register",
      user
    );

    // console.log(response);

    if (response.err) {
      showErrorToast(response.err);
      setLoading(false);
      return;
    }

    if (response && !response.err) {
      const token = response.user.token;
      const userData = response.user;
      setCookie("token", token, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      setCookie("user", userData, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      setLoading(false);
      showSuccessToast("User registered successfully!!");
      setIsAuthenticated(true);
      navigate("/");
    }
  }

  const override = {
    display: "block",
    position: "absolute",
    margin: "0 auto",
    transform: "translate(47vw,40vh)",
    borderColor: "green",
  };
  return (
    <div className="login-container min-h-screen bg-[#121212] flex flex-col">
      {Loading && (
        <div className="absolute top-0 left-0 z-[99999] h-[100vh] w-full bg-black bg-opacity-70">
          <PulseLoader color="#1db954" cssOverride={override} />
        </div>
      )}
      <div className="login-header h-[5rem] flex items-center bg-[#121212] pl-8">
        <Icon icon="logos:spotify" className="text-white w-[120px] h-[45px]" />
      </div>

      <div className="relative flex justify-center flex-1 login-box-wrapper">
        <div className="relative login-input-container text-white flex flex-col justify-center items-center bg-[#121212] max-w-[800px] flex-1 rounded-lg pt-4 pb-12 max-[500px]:px-4">
          {/* /////// main signup step-0 //////  */}

          <div className={`step-0 ${count === 0 ? "block" : "hidden"}`}>
            <h1 className="text-[2.8rem] font-bold mb-8">
              Sign up to start <br />
              listening
            </h1>
            <div className="w-[350px] relative  max-[500px]:w-full">
              <div>
                <div>
                  <label htmlFor="email" className="font-semibold">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    onChange={(e) => {
                      handlesignupInput(e);
                    }}
                    value={email}
                    placeholder="Email"
                    className="w-full outline-4 outline-white bg-[#7676762e] p-3 border-[1px] border-white rounded-md mt-2"
                  />
                </div>

                <button
                  className="bg-[#1ed760] text-black font-bold w-full h-12 rounded-[2rem] mt-8"
                  onClick={increaseCount}
                >
                  Next
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
                  Already have an account?
                </p>
                <Link to="/login">
                  <div className="underline hover:text-[#1ed760]">
                    Login here
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* ///////step indicators////////  */}

          <div
            className={`steps-indicator w-[450px] max-[500px]:w-[100%] ${
              count > 0 ? "block" : "hidden"
            }`}
          >
            <div className="relative">
              <span className="w-full h-[2px] bg-gray-400 block mb-8"></span>
              <span
                className="absolute top-0  h-[2px] bg-[#1ed760] block ease-in duration-200"
                style={
                  count === 2
                    ? { width: "66.66%" }
                    : count === 3
                    ? { width: "100%" }
                    : count === 1
                    ? { width: "33.33%" }
                    : { width: "0" }
                }
              ></span>
            </div>
            <div className="max-w-[450px] flex gap-8 mb-8">
              <button className="" onClick={decreaseCount}>
                <Icon
                  icon="topcoat:back"
                  className="h-[25px] w-[20px ]"
                  color="white"
                />
              </button>
              <div>
                <h2 className="text-gray-400">Step {count} of 3</h2>
                <h2 className="hidden font-semibold">Create a password</h2>
                <h2 className="hidden font-semibold">Tell us about yourself</h2>
                <h2 className="font-semibold">Terms & Conditions</h2>
              </div>
            </div>
          </div>

          {/* //////// steps for signup /////////  */}

          {/* //////// step-1 //////// */}

          <div
            className={`step-1 w-[350px] relative  max-[500px]:w-full flex-1 ${
              count === 1 ? "block" : "hidden"
            }`}
          >
            <div className="flex-1">
              <label htmlFor="password" className="font-semibold">
                Password
              </label>
              <input
                type="text"
                name="password"
                autoComplete="off"
                id="password"
                onChange={handlesignupInput}
                value={password}
                placeholder="Password"
                className="w-full flex-1 outline-4 outline-white bg-[#7676762e] p-3 border-[1px] border-white rounded-md mt-2"
              />
              <p className="text-sm font-semibold text-gray-400">
                The password must containt 8 characters. We recommend including
                atleast 1 number and 1 special character.
              </p>
              <button
                className="bg-[#1ed760] text-black font-bold w-full h-12 rounded-[2rem] mt-8"
                onClick={increaseCount}
              >
                Next
              </button>
            </div>
          </div>

          {/* //////// step-2 ///////// */}

          <div
            className={`step-2 w-[350px] relative  max-[500px]:w-full flex-1 ${
              count === 2 ? "block" : "hidden"
            }`}
          >
            <div className="flex-1">
              <div>
                <label htmlFor="name" className="text-sm font-semibold">
                  Name
                </label>
                <p className="text-sm font-semibold text-gray-400">
                  This name will appear on your profile
                </p>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handlesignupInput}
                  value={name}
                  placeholder="Name"
                  className="w-full outline-4 outline-white bg-[#7676762e] p-3 border-[1px] border-white rounded-md mt-2"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="dob" className="text-sm font-semibold">
                  Date of birth
                </label>
                <p className="text-sm font-semibold text-gray-400">
                  Why do we need your date of birth?{" "}
                  <a href="" className="underline">
                    Learn more
                  </a>
                </p>
                <div className="flex justify-between mt-2">
                  <input
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                    }}
                    type="text"
                    name="year"
                    id="year"
                    placeholder="yyyy"
                    className="w-[20%] p-3 bg-[#7676762e] rounded-md"
                  />
                  <div className="w-[35%] relative">
                    <button
                      onClick={() => {
                        setopenMonth(!setopenMonth);
                        setClick(true);
                      }}
                      type="text"
                      name="month"
                      id="month"
                      placeholder="Month"
                      className={`p-3 bg-[#7676762e] rounded-md w-full text-start  cursor-default ${
                        btnclicked
                          ? "border-[1px] border-white"
                          : "border-[1px] border-transparent"
                      }`}
                    >
                      {month}
                      <Icon
                        icon="ri:arrow-drop-down-line"
                        color="white"
                        className="absolute right-0 w-8 h-8 top-2"
                      />
                    </button>

                    <div
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgb(226 226 226 / 15%) 0px 0px 0px 1px",
                      }}
                      className={
                        !openMonth
                          ? "scroll-smooth months h-[200px] overflow-y-auto absolute flex flex-col bg-[#121212] child:px-8 child:text-start text-[14px] child:py-1 child:font-semibold hover:child:bg-blue-500 rounded-md"
                          : "hidden"
                      }
                    >
                      <p
                        onClick={() => {
                          setMonth("Month");
                          setClickbtn();
                        }}
                        className="text-gray-400"
                      >
                        Months
                      </p>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("January");
                          setClickbtn();
                        }}
                      >
                        January
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("February");
                          setClickbtn();
                        }}
                      >
                        February
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("March");
                          setClickbtn();
                        }}
                      >
                        March
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("April");
                          setClickbtn();
                        }}
                      >
                        April
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("May");
                          setClickbtn();
                        }}
                      >
                        May
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("June");
                          setClickbtn();
                        }}
                      >
                        June
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("July");
                          setClickbtn();
                        }}
                      >
                        July
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("August");
                          setClickbtn();
                        }}
                      >
                        August
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("September");
                          setClickbtn();
                        }}
                      >
                        September
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("October");
                          setClickbtn();
                        }}
                      >
                        October
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("November");
                          setClickbtn();
                        }}
                      >
                        November
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          setMonth("December");
                          setClickbtn();
                        }}
                      >
                        December
                      </button>
                    </div>
                  </div>
                  <input
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                    type="text"
                    name="date"
                    id="date"
                    placeholder="dd"
                    className="w-[20%] p-3 bg-[#7676762e] rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="" className="text-sm font-semibold">
                  Gender
                </label>
                <p className="text-sm font-semibold text-gray-400">
                  We use your gender to help personalise our content
                  recommendations and ads for you.
                </p>

                <div className="flex flex-wrap mt-2 gender-options child:whitespace-nowrap gap-x-16 gap-y-2">
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="Man"
                      className=" bg-[#7676762e]"
                      value="Man"
                      checked={gender === "Man"}
                      onChange={Changender}
                    />
                    <label htmlFor="Man" className="text-sm font-semibold">
                      Man
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="Woman"
                      className=" bg-[#7676762e]"
                      value="Man"
                      checked={gender === "Woman"}
                      onChange={Changender}
                    />
                    <label htmlFor="Woman" className="text-sm font-semibold">
                      Woman
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="Non-binary"
                      className=" bg-[#7676762e]"
                      value="Non-binary"
                      checked={gender === "Non-binary"}
                      onChange={Changender}
                    />
                    <label
                      htmlFor="Non-binary"
                      className="text-sm font-semibold"
                    >
                      Non-binary
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="Something_else"
                      className=" bg-[#7676762e]"
                      value="Somethingelse"
                      checked={gender === "Somethingelse"}
                      onChange={Changender}
                    />
                    <label
                      htmlFor="Something_else"
                      className="text-sm font-semibold"
                    >
                      Something else
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      id="Prefer_not_to_say"
                      className=" bg-[#7676762e]"
                      value="Prefer_not_to_say"
                      checked={gender === "Prefer_not_to_say"}
                      onChange={Changender}
                    />
                    <label
                      htmlFor="Prefer_not_to_say"
                      className="text-sm font-semibold"
                    >
                      Prefer not to say
                    </label>
                  </div>
                </div>
              </div>

              <button
                className="bg-[#1ed760] text-black font-bold w-full h-12 rounded-[2rem] mt-8"
                onClick={increaseCount}
              >
                Next
              </button>
            </div>
          </div>

          {/* ///// step-3 ////// */}

          <div className={`step-3 ${count === 3 ? "block" : "hidden"} flex-1`}>
            <div className="w-[350px] relative  max-[500px]:w-full">
              <div>
                <label
                  htmlFor="term1"
                  className="term1 flex gap-4 bg-[#232323] p-3 rounded-lg"
                >
                  <input type="checkbox" name="term1" id="term1" />
                  <p>
                    I would prefer not to receive marketing messages from
                    Spotify
                  </p>
                </label>
                <label
                  htmlFor="term2"
                  className="term1 flex gap-4 bg-[#232323] p-3 rounded-lg mt-4"
                >
                  <input type="checkbox" name="term1" id="term2" />
                  <p>
                    Share my registration data with Spotify’s content providers
                    for marketing purposes.
                  </p>
                </label>
                <p className="mt-4 text-sm font-semibold">
                  By clicking on ‘Sign up’, you agree to Spotify’s <br />{" "}
                  <span className="text-[#1ed760]">
                    Terms and Conditions of Use.
                  </span>
                </p>
                <p className="mt-4 text-sm font-semibold">
                  To learn more about how Spotify collects, uses, shares and
                  protects your personal data, please see{" "}
                  <span className="text-[#1ed760]">
                    Spotify’s Privacy Policy.
                  </span>
                </p>

                <button
                  className="bg-[#1ed760] text-black font-bold w-full h-12 rounded-[2rem] mt-8"
                  onClick={submitUser}
                >
                  Signup
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs mt-[3rem] text-center">
            This site is protected by reCAPTCHA and the Google <br />
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

export default Signup;
