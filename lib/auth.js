import Router from "next/router";
import axios from "axios";
import { token } from "morgan";
const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";
import localforage from"localforage";

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = req => {
  if (req.user) {
    return { user: req.user };
  }
  return {};
};

export const getSessionFromClient = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = isProtectedRoute => ({
  req,
  res,
  query: { userId }
}) => {
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if ( isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirectUser(res, "/signin");
  }
  return { auth, userId };
};

export const signUpUser = async(user) => {
  const {data} = await axios.post('/api/auth/signup',user);
}

export const signInUser = async(user) => {
  user.agent=navigator.userAgent
  const { data } = await axios.post("/api/auth/signin", user);
  var fcm_token = null;
  fcm_token = await localforage.getItem("fcm_token");
  await module.exports.sendPushTokenServer(fcm_token);
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
}

export const signoutUser = async() => {
  const { data } = await axios.get("/api/auth/signout");
  window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  Router.push(`/signin`);
}

export const checkLoggedInUser = isProtectedRoute => ({
  req,
  res,
  query: { userId }
}) => {
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const user = auth.user;
  const isLoggedIn = user;
  if (isLoggedIn && isLoggedIn._id) {
    return redirectUser(res, `/`);
  }
  return { auth, userId };
}

export const sendPushTokenServer = async(token)=>{
  const {data} = await axios.post('/api/push/token',{token:token});
}

export const getAllSessions = async(user) => {
  const data = await axios.get('/api/auth/sessions');
  return data;
}

export const signOutUsersession = async(id)=>{
  const {data} = await axios.post('/api/auth/signoutsession',{sessionId:id});
  console.log(data);
}