import React from "react";
import { GoogleLogin } from "react-google-login";
import { refreshTokenSetup } from "./refreshtoken.js";
import { signinGoogle } from "../lib/auth";
const clientId =
  "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com";

function Login() {
  const onSuccess = (res) => {
    console.log(res);
    signinGoogle(res.profileObj)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    alert(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Continue with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        theme="dark"
        style={{ marginTop: "14px", width: "250px" }}
      />
    </div>
  );
}

export default Login;
