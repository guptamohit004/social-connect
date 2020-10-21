import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import AccountBox from "@material-ui/icons/AccountBox";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";

const FollowTab = ({ classes, users }) => (
  <div className={classes.root}>
  <List>
  {users.map((user, i) => (
    <span key={user._id}>
      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          <Avatar src={user.avatar} />
        </ListItemAvatar>
        <Link href={`/profile/${user.username}`}>
          <ListItemText style={{cursor: 'pointer'}} primary={user.name}  secondary= {user.username}  />
        </Link>
      </ListItem>
    </span>
  ))}
</List>
  </div>
);

const styles = theme => ({
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  gridList: {
    width: 300,
    [theme.breakpoints.up("sm")]: {
      width: 400
    }
  },
  tileText: {
    textAlign: "center",
    marginTop: 10
  }
});

export default withStyles(styles)(FollowTab);
