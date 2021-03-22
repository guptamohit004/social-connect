import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import moment from 'moment';
import { NextSeo } from 'next-seo';
import FollowUser from "../../../components/profile/FollowUser";
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import { withRouter } from 'next/router';
import Router from "next/router";
import { authInitialProps } from "../../../lib/auth";
import {
  getPostsByUser,
  getUserProfile,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from "../../../lib/data";

import ProfileTabs from "../../../components/profile/ProfileTabs";

class post extends React.Component {
  state = {
    user:null,
    isAuth:false,
    isLoading:true
  };
  componentDidMount(){
    const {auth,userId} = this.props;
    console.log("Logged     in user is : " + auth.user.username);
    console.log("Requested  user is    : " + userId);
    var isAuth = auth.user.username===userId;
    getUserProfile(userId)
    .then(async requesteduser => {
      const isFollowing = this.checkFollowing(auth,requesteduser);
      const isFollower = this.checkFollower(auth,requesteduser);
      const posts = await getPostsByUser(userId);
      this.setState({
        user:requesteduser,
        isAuth:isAuth,
        isLoading:false,
        isFollowing,
        isFollower,
        posts
      });
    })
    .catch(err => {
      Router.replace('/404');
    });
  }
  checkFollowing = (auth,requesteduser)=>{
    return requesteduser.followers.findIndex(follower => follower._id
          === auth.user._id ) > -1;
  }
  handleError = err => {
    const error = (err.response && err.response.data) || err.message;
    swal({
      title: "Please Try Again",
      text: error,
      icon: "error"
    });
  };
  checkFollower = (auth,requesteduser)=>{
    return requesteduser.following.findIndex(follower => follower._id
          === auth.user._id ) > -1;
  }
  toggleFollow = sendRequest => {
    console.log(this.props)
    const { userId } = this.props;
    const { isFollowing } = this.state;
    sendRequest(userId).then(() => {
      this.setState({ isFollowing: !isFollowing });
    });
  };

  handleDeletePost = deletedPost => {
    this.setState({ isDeletingPost: true });
    deletePost(deletedPost._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({
          posts: updatedPosts,
          isDeletingPost: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDeletingPost: false });
      });
  };

  handleToggleLike = post => {
    const { auth } = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    sendRequest(post._id)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => console.error(err));
  };

  handleAddComment = (postId, text) => {
    const comment = { text };
    addComment(postId, comment)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => console.error(err));
  };

  handleDeleteComment = (postId, comment) => {
    deleteComment(postId, comment)
      .then(postData => {
        const postIndex = this.state.posts.findIndex(
          post => post._id === postData._id
        );
        const updatedPosts = [
          ...this.state.posts.slice(0, postIndex),
          postData,
          ...this.state.posts.slice(postIndex + 1)
        ];
        this.setState({ posts: updatedPosts });
      })
      .catch(err => console.error(err));
  };
  render() {
    const { classes, auth } = this.props;
      const {
      isLoading,
      posts,
      user,
      isAuth,
      isFollowing,
      isFollower,
      isDeletingPost
    } = this.state;
    return (
      <Paper className={classes.root} elevation={4}>
            {

                (user!=null || user!=undefined )
                ? (
                        <NextSeo
                            title={`${user.name} @(${user.username})  Profie and Posts `}
                            description={`${user.name} @(${user.username})  Profie and Posts on Social Connect`}
                        />
                  )
                :
                 (
                        <NextSeo
                        />
                  )
            }
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className={classes.title}
          gutterBottom
        >
          Profile
        </Typography>
        {isLoading ? (
            <div className={classes.progressContainer}>
              <CircularProgress
                className={classes.progress}
                size={55}
                thickness={5}
              />
            </div>
          ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name +' @('+user.username+')'} secondary={user.email} />
              {/* Auth - Edit Buttons / UnAuth - Follow Buttons */}
              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href="/edit-profile">
                    <a>
                    <Tooltip title="Edit Profile" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                      </Tooltip>
                    </a>
                  </Link>
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing = {isFollowing}
                  isFollower = {isFollower}
                  toggleFollow = {this.toggleFollow}
                />
              )}
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                secondary={user.about}
                primary={`Joined: ${moment(user.createdAt, moment.ISO_8601).format("dddd, MMM Do YYYY, h:mm:ss a").substring(0,14)} (${moment().diff(user.createdAt,'days')} Days Ago)`}
              />
            </ListItem>
            <ProfileTabs
              auth={auth}
              posts={posts}
              user={user}
              isDeletingPost={isDeletingPost}
              handleDeletePost={this.handleDeletePost}
              handleToggleLike={this.handleToggleLike}
              handleAddComment={this.handleAddComment}
              handleDeleteComment={this.handleDeleteComment}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 600
    }
  },
  title: {
    color: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bigAvatar: {
    width: 90,
    height: 90,
    margin: 10
  }
});

post.getInitialProps = authInitialProps(true);

export default withRouter(withStyles(styles)(post));