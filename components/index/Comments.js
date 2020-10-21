import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import Delete from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";
import moment from 'moment';

class Comments extends React.Component {
  state = {
    text: ""
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = event => {
    const { text } = this.state;
    const { postId, handleAddComment } = this.props;

    event.preventDefault();
    handleAddComment(postId, text);
    this.setState({ text: "" });
  };

  showComment = comment => {
    if(moment().diff(comment.createdAt,'seconds') <= 60)
    {
       var DateofCreation = `Just Now`;
    }
    else if(moment().diff(comment.createdAt,'minutes') <= 60)
    {
       var DateofCreation = `${moment().diff(comment.createdAt,'minutes')} minutes ago`;
    }
    else if(moment().diff(comment.createdAt,'hours') <= 24)
    {
       var DateofCreation = `${moment().diff(comment.createdAt,'hours')} hours ago`;
    }
    else if(moment().diff(comment.createdAt,'days') <= 30)
    {
       var DateofCreation = `${moment().diff(comment.createdAt,'days')} days ago`;
    }
    else if(moment().diff(comment.createdAt,'months') <= 12)
    {
       var DateofCreation = `${moment().diff(comment.createdAt,'months')} months ago`;
    }
    const { postId, auth, classes, handleDeleteComment,isFromPopup } = this.props;
    const isCommentCreator = comment.postedBy._id === auth.user._id;
    return (
      <div>
        <Link href={`/profile/${comment.postedBy.username}`}>
          <a
          style={{
            textDecoration: "none",
            margin: 0,
            padding: 0,
            fontWeight:"normal",
            color:"#C62828"
          }}>
          {comment.postedBy.name} (@{comment.postedBy.username})</a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {DateofCreation}
          {isCommentCreator && (
            <Delete
              color="secondary"
              className={classes.commentDelete}
              onClick={() => handleDeleteComment(postId, comment)}
            />
          )}
        </span>
      </div>
    );
  };

  render() {
    const { auth, comments, classes,isFromPopup } = this.props;
    const { text } = this.state;
    let commentsCopy = Object.create(comments);
    commentsCopy = isFromPopup != '1'  ? commentsCopy.splice(0,3) : commentsCopy;
    return (
      <div className={classes.comments}>
        {/* Comment Input */}
        {1?
        <CardHeader
          avatar={
            <Avatar className={classes.smallAvatar} src={auth.user.avatar} />
          }
          title={
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="add-comment">Add comments</InputLabel>
                <Input
                  id="add-comment"
                  name="text"
                  placeholder="Reply to this post"
                  value={text}
                  onChange={this.handleChange}
                />
              </FormControl>
            </form>
          }
          className={classes.cardHeader}
        />:''}

        {/* Comments */}
        {commentsCopy.map(comment => (
          <CardHeader
            key={comment._id}
            avatar={
              <Avatar
                className={classes.smallAvatar}
                src={comment.postedBy.avatar}
              />
            }
            title={this.showComment(comment)}
            className={classes.cardHeader}
          />
        ))}
      </div>
    );
  }
}

const styles = theme => ({
  comments: {
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    margin: 10
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em"
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer"
  }
});

export default withStyles(styles)(Comments);
