import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Router from "next/router";
import Paper from "@material-ui/core/Paper";
import PostFeed from "../components/index/PostFeed";
import UserFeed from "../components/index/UserFeed";
import withStyles from "@material-ui/core/styles/withStyles";
import { authInitialProps } from "../lib/auth";

const Index = ({ classes, auth }) => (
  <main className={classes.root}>
    {auth.user && auth.user._id ? (
      // Auth User Page
      <Grid container className={classes.postContainer}>
        <Grid item xs={12} sm={12} md={7}>
          <PostFeed auth={auth} />
        </Grid>
        <Grid item className={classes.drawerContainer}>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="right"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <UserFeed auth={auth} />
          </Drawer>
        </Grid>
      </Grid>
    ) : (
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <fragment className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <br />
            <Grid container>
              <Grid item xs></Grid>
              <Grid item style={{ "margin-right": "75px" }}>
                <Typography component="h1" variant="h5">
                  <Button variant="contained" color="primary" href="/signin">
                    Login
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </fragment>
          <fragment className={classes.paper2}>
            <Typography component="h1" variant="h5">
              A place to talk and have community-based discussions with
              like-minded people.
            </Typography>
            <br />
            <Typography component="h2" variant="h6">
              Get Started Today.
            </Typography>
          </fragment>
        </Grid>
      </Grid>
    )}
  </main>
);

const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  avatar: {
    "margin-left": "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "centre",
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    "margin-top": "120px",
    "margin-bottom": "60px",
    display: "flex",
  },
  paper2: {
    "margin-left": "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "centre",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  progressContainer: {
    height: "80vh",
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.light,
  },
  drawerContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  postContainer: {
    marginBottom: "134px",
  },
  drawer: {
    width: 350,
  },
  drawerPaper: {
    marginTop: 70,
    width: 350,
  },
  fabButton: {
    margin: theme.spacing.unit * 3,
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 6,
    margin: "0 auto",
  },
});

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
