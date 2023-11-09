import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Common/Login";
import SignUp from "./Components/Common/SignUp";
import ForgotPassword from "./Components/Common/ForgotPassword";
import Profile from "./Components/Common/Profile";
import { MainProvider } from "./Context/MainContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MainProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
      <App />
    </HashRouter>
  </MainProvider>
);
