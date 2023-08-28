import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`currentUser: ${JSON.stringify(auth.currentUser)}`)

    if (auth.currentUser?.isAnonymous === true) {      
      navigate("/");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
};

export default AuthChecker;
