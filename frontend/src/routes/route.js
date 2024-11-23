import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired,  unsetToken } from "../helpers/jwt-token-access/accessToken";

function Authmiddleware(props){
  // todo: need to implement auth middleware
  // console.log("dqwdq", isTokenExpired())
  if (isTokenExpired()) {
    unsetToken();
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }
  // remove expired token if any
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default Authmiddleware;
