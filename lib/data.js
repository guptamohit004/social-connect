import Router from "next/router";
import axios from "axios";
const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserProfile = async userId => {
    const {data} = await axios.get(`/api/users/profile/${userId}`);
    return data;
};

export const followUser = async followId =>{
    const {data} = await axios.put('/api/users/follow',{follow : followId})
    return data;
}

export const UnfollowUser = async followId =>{
    const {data} = await axios.put('/api/users/unfollow',{follow : followId})
}

export const getAuthUser = async authUserId =>{
    const {data} = await axios.get(`/api/users/${authUserId}`);
    return data;
}

export const updateUser = async (authUserId, userData) => {
    const { data } = await axios.put(`/api/users/${authUserId}`, userData);
    return data;
  };

export const fetchNotifications = async () => {
    const { data } = await axios.get(`/api/notifications`);
    return data;
}

export const markReadNotification = async()=>{
    const { data } = await axios.put(`/api/notifications`);
}


export const getUserFeed = async authUserId => {
    const {data} =  await axios.get(`/api/users/feed/${authUserId}`)
    return data;
}

export const addPost = async (authUserId, post) => {
    const { data } = await axios.post(`/api/posts/new/${authUserId}`, post);
    return data;
  };

  export const getPostFeed = async authUserId => {
    const { data } = await axios.get(`/api/posts/feed/${authUserId}`);
    return data;
  };

  export const deletePost = async postId => {
    const { data } = await axios.delete(`/api/posts/${postId}`);
    return data;
  };

  export const likePost = async postId => {
    const { data } = await axios.put(`/api/posts/like`, { postId });
    return data;
  };

  export const unlikePost = async postId => {
    const { data } = await axios.put(`/api/posts/unlike`, { postId });
    return data;
  };

  export const addComment = async (postId, comment) => {
    const { data } = await axios.put("/api/posts/comment", { postId, comment });
    return data;
  };

  export const deleteComment = async (postId, comment) => {
    const { data } = await axios.put("/api/posts/uncomment", { postId, comment });
    return data;
  };

  export const getPostsByUser = async userId => {
    const { data } = await axios.get(`/api/posts/by/${userId}`);
    return data;
  };
