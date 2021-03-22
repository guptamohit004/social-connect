import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { NextSeo } from 'next-seo';
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import React from "react";
import {signUpUser,checkLoggedInUser} from '../lib/auth';
import Link from "next/link";

function Transition(props){
  return <Slide direction="up"  {...props} />;
}

class Signup extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    username:"",
    error: "",
    createdUser: "",
    openError: false,
    openSuccess: false,
    isLoading: false,
    showPassword:false
  };

  handleClose = () => this.setState({ openError: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPassword = () => {
    const {showPassword} = this.state;
    this.setState({showPassword : !showPassword});
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  handleSubmit = event => {
    const { name, email, password,username } = this.state;

    event.preventDefault();
    const user = { name, email, password ,username};
    this.setState({ isLoading: true, error: "" });
    signUpUser(user)
      .then(createdUser => {
        this.setState({
          createdUser,
          error: "",
          openSuccess: true,
          isLoading: false
        });
      })
      .catch(this.showError);
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isLoading: false });
  };

  render() {
    const { classes } = this.props;
    const {
      error,
      openError,
      openSuccess,
      createdUser,
      isLoading,
      showPassword
    } = this.state;
    return(
    <div className={classes.root}>
    <NextSeo
      title= "Sign In | Social Connect"
      description= "Sign In | Social Connect"
    />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon/>
        </Avatar>
        <Typography variant="h5" component="h1">
          Sign Up
        </Typography>
        <form onSubmit={this.handleSubmit} className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input
              name="name"
              type="text"
              onChange={this.handleChange}
            />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="Email">Email</InputLabel>
            <Input
              name="email"
              type="email"
              onChange={this.handleChange}
            />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              name="username"
              type="text"
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={this.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              className={classes.submit}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
          {/* Error Snackbar */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={openError}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
      </Paper>
      <Dialog
              open={openSuccess}
              disableBackdropClick={true}
              TransitionComponent={Transition}
      >
        <DialogTitle>
        <VerifiedUserTwoTone className={classes.icon} />
        New Account
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          User {createdUser} successfully created!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          <Link href="/signin">
            <a className={classes.signinLink}>Sign in</a>
          </Link>
        </Button>
      </DialogActions>
      </Dialog>
    </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: "none",
    color: "white"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.secondary.light
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  }
});

Signup.getInitialProps = checkLoggedInUser();

export default withStyles(styles)(Signup);
