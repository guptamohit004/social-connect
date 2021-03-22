import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Loader from 'react-loader-spinner'

import NewPost from "./NewPost";
import Post from "./Post";
import {
  addPost,
  deletePost,
  likePost,
  unlikePost,
  getPostFeed,
  addComment,
  deleteComment
} from "../../lib/data";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    image: "",
    avatarPreview:"",
    isAddingPost: false,
    isDeletingPost: false,
    isGettingPosts:true
  };

  componentDidMount() {
    this.postData = new FormData();
    this.getPosts();
  }

  getPosts = () => {
    const { auth } = this.props;
    getPostFeed(auth.user.username).then(posts => this.setState({ posts,isGettingPosts:false }));
  };

  handleChange = event => {
    let inputValue;
    if (event.target.name === "image") {
      inputValue = event.target.files[0];
      this.setState({ avatarPreview: this.createPreviewImage(inputValue) });
    } else {
      inputValue = event.target.value;
    }
    this.postData.set(event.target.name, inputValue);
    this.setState({ [event.target.name]: inputValue });
  };
  createPreviewImage = file => URL.createObjectURL(file);
  handleAddPost = () => {
    const { auth } = this.props;

    this.setState({ isAddingPost: true });
    addPost(auth.user.username, this.postData)
      .then(postData => {
        const updatedPosts = [postData, ...this.state.posts];
        this.setState({
          posts: updatedPosts,
          isAddingPost: false,
          text: "",
          image: "",
          avatarPreview:""
        });
        this.postData.delete("image");
      })
      .catch(err => {
        console.error(err);
        this.setState({ isAddingPost: false });
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

    const isPostLiked = post.likes.includes(auth.user.username);
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
    const { posts, text, image, isAddingPost, isDeletingPost } = this.state;
    let loadingDiv =
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
     </div>
    const PostsData=posts.map(post => (
      <Post
        key={post._id}
        auth={auth}
        post={post}
        isDeletingPost={isDeletingPost}
        handleDeletePost={this.handleDeletePost}
        handleToggleLike={this.handleToggleLike}
        handleAddComment={this.handleAddComment}
        handleDeleteComment={this.handleDeleteComment}
      />
    ))
    return (
      <div className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          className={classes.title}
        >
          Post Feed
        </Typography>
        {isAddingPost?
          <NewPost
            auth={auth}
            text={text}
            image={image}
            imagePreview={this.state.avatarPreview}
            isAddingPost={isAddingPost}
            handleChange={this.handleChange}
            handleAddPost={this.handleAddPost}
          />
          :
          <NewPost
            auth={auth}
            text={text}
            image={image}
            imagePreview={this.state.avatarPreview}
            isAddingPost={isAddingPost}
            handleChange={this.handleChange}
            handleAddPost={this.handleAddPost}
          />
        }
        {this.state.isGettingPosts ? loadingDiv : PostsData}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(PostFeed);
