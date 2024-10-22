import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import withStyles from "@material-ui/core/styles/withStyles";

const NewPost = ({
  classes,
  auth,
  text,
  imagePreview,
  image,
  isAddingPost,
  handleChange,
  handleAddPost
}) => (
  <Card className={classes.card}>
    <CardHeader
      avatar={<Avatar src={auth.user.avatar} />}
      title={
        <Typography variant="h6" component="h2">
          {auth.user.name}
        </Typography>
      }
      className={classes.cardHeader}
    />
    <CardContent className={classes.cardContent}>
      <TextField
        label="Add a caption."
        value={text}
        name="text"
        multiline
        row="2"
        placeholder={`What's on your mind, ${auth.user.name}?`}
        fullWidth
        margin="normal"
        onChange={handleChange}
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
      />
      <input
        accept="image/*"
        name="image"
        id="image"
        onChange={handleChange}
        className={classes.input}
        type="file"
        required
      />
      <label htmlFor="image">
        <IconButton color="secondary" component="span">
          <AddAPhoto />
        </IconButton>
      </label>
      {imagePreview?<Avatar  src={imagePreview} className={classes.bigAvatar}/>:''}
    </CardContent>
    <CardActions className={classes.cardActions}>
      <Button
        color="primary"
        variant="contained"
        disabled={(!text || (imagePreview == "")) || isAddingPost}
        className={classes.submit}
        onClick={handleAddPost}
      >
        {isAddingPost ? "Posting" : "Post"}
      </Button>
    </CardActions>
  </Card>
);

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 3
  },
  cardContent: {
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: "auto"
  },
  input: {
    display: "none"
  },
  cardActions: {
    display: "flex",
    flexDirection: "row-reverse"
  }
});

export default withStyles(styles)(NewPost);
