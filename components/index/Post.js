import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Comment from "@material-ui/icons/Comment";
import DeleteTwoTone from "@material-ui/icons/DeleteTwoTone";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import CommentModel from "./CommentModel";
import moment from 'moment';
import Comments from "./Comments";
import LinkMaterial from '@material-ui/core/Link';

class Post extends React.PureComponent {
  state = {
    isLiked: false,
    numLikes: 0,
    likes:[],
    comments: [],
    DateofCreation:''
  };

  componentDidMount() {
    if(moment().diff(this.props.post.createdAt,'seconds') <= 60)
    {
       var DateofCreation = `${moment().diff(this.props.post.createdAt,'seconds')} seconds ago`;
    }
    else if(moment().diff(this.props.post.createdAt,'minutes') <= 60)
    {
       var DateofCreation = `${moment().diff(this.props.post.createdAt,'minutes')} minutes ago`;
    }
    else if(moment().diff(this.props.post.createdAt,'hours') <= 24)
    {
       var DateofCreation = `${moment().diff(this.props.post.createdAt,'hours')} hours ago`;
    }
    else if(moment().diff(this.props.post.createdAt,'days') <= 30)
    {
       var DateofCreation = `${moment().diff(this.props.post.createdAt,'days')} days ago`;
    }
    else if(moment().diff(this.props.post.createdAt,'months') <= 12)
    {
       var DateofCreation = `${moment().diff(this.props.post.createdAt,'months')} months ago`;
    }
    this.setState({
      isLiked: this.checkLiked(this.props.post.likes),
      numLikes: this.props.post.likes.length,
      likes:this.props.post.likes,
      comments: this.props.post.comments.reverse(),
      DateofCreation:DateofCreation
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.likes.length !== this.props.post.likes.length) {
      this.setState({
        isLiked: this.checkLiked(this.props.post.likes),
        numLikes: this.props.post.likes.length
      });
    }

    if (prevProps.post.comments.length !== this.props.post.comments.length) {
      this.setState({
        comments: this.props.post.comments.reverse()
      });
    }
  }

  checkLiked = likes => likes.includes(this.props.auth.user._id);

  render() {
    const {
      classes,
      post,
      auth,
      likes,
      isDeletingPost,
      handleDeletePost,
      handleToggleLike,
      handleAddComment,
      handleDeleteComment
    } = this.props;
    const { isLiked, numLikes, comments } = this.state;
    const isPostCreator = post.postedBy._id === auth.user._id;
    let dataMarkup =(
      <div>
        Liked By {numLikes}.
      </div>
     )
    return (
      <Card className={classes.card}>
        {/* Post Header */}
        <CardHeader
          avatar={<Avatar src={post.postedBy.avatar} />}
          action={
            isPostCreator && (
              <IconButton
                disabled={isDeletingPost}
                onClick={() => handleDeletePost(post)}
              >
                <DeleteTwoTone color="secondary" />
              </IconButton>
            )
          }
          title={
            <Link href={`/profile/${post.postedBy.username}`}>
              <a style={{
                textDecoration: "none",
                margin: 0,
                padding: 0,
                fontWeight:"normal",
                color:"#C62828"
              }}>
              {post.postedBy.name} @{post.postedBy.username}</a>
            </Link>
          }
          subheader={this.state.DateofCreation}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="body1" className={classes.text}>
            {post.caption}
          </Typography>
          {/* Post Image */}
          {post.image && (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={post.image} />
            </div>
          )}
        </CardContent>

        {/* Post Actions */}
        <CardActions>
          <IconButton
            onClick={() => handleToggleLike(post)}
            className={classes.button}
          >
              {isLiked ? (
                <Favorite className={classes.favoriteIcon} />
              ) : (
                <FavoriteBorder className={classes.favoriteIcon} />
              )}
          </IconButton>
          <CommentModel
            auth={auth}
            postId={post._id}
            comments={comments}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            classes={classes}
            comments={comments}
          />
          </CardActions>
          <Divider />
          <CardContent className={classes.likeContent}>
            <Typography variant="body1" className={classes.likeContent}>
                {dataMarkup}
            </Typography>
          </CardContent>
          <Divider />
          <Comments
            auth={auth}
            postId={post._id}
            comments={comments}
            isFromPopup={111}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
          />
      </Card>
    );
  }
}

const styles = theme => ({
  text:{
    color:"black"
  },
  card: {
    marginBottom: theme.spacing.unit * 3
  },
  cardContent: {
    backgroundColor: "white"
  },
  likeContent: {
    color:"White"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  imageContainer: {
    textAlign: "center",
    padding: theme.spacing.unit
  },
  image: {
    height: 200
  },
  favoriteIcon: {
    color: theme.palette.favoriteIcon
  },
  commentIcon: {
    color: theme.palette.commentIcon
  }
});

export default withStyles(styles)(Post);
