// ProtectedRoute.js
import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateWrapper = ({ isAuthenticated, children }) => {
  console.log("calling route");
  const navigate = useNavigate();
  if (isAuthenticated) {
    return children;
  } else {
    navigate("/login");
  }
};

export default PrivateWrapper;
