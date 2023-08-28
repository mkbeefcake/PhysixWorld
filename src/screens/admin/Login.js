import { Box } from "@mui/material";
import React, { useState } from "react";
import Center from "../../components/utils/Center";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(`login process: ${email}, ${password}`);

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        navigate("/admin/dashboard")
      })
      .catch(err => {
        alert(err);
      }) 
    }

  const handleEmailChanged = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  }

  return (
    <Center height={90}>
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        boxShadow={2}
        margin={3}
        color={"white"}
      >
        <div className="Auth-form-container">
          <div className="Auth-form">
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign In</h3>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChanged}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChanged}
                />
              </div>
              <div className="d-grid gap-2 mt-3">
                <button className="btn btn-primary" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

      </Box>
    </Center>
  );
};

export default Login;
