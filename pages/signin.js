import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { NextSeo } from "next-seo";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Lock from "@material-ui/icons/Lock";
import withStyles from "@material-ui/core/styles/withStyles";
import { signInUser } from "../lib/auth";
import Router from "next/router";
import InputAdornment from "@material-ui/core/InputAdornment";
import { checkLoggedInUser } from "../lib/auth";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

class Signin extends React.Component {
  state = {
    username: "",
    password: "",
    error: "",
    createdUser: "",
    openError: false,
    openSuccess: false,
    isLoading: false,
    showPassword: false,
  };

  handleClose = () => this.setState({ openError: false });

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    const { password, username } = this.state;

    event.preventDefault();
    const user = { password, username };
    this.setState({ isLoading: true, error: "" });
    signInUser(user)
      .then(() => {
        window.location.href = "/";
      })
      .catch(this.showError);
  };

  showError = (err) => {
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
      showPassword,
    } = this.state;
    return (
      <div className={classes.root}>
        <NextSeo
          title="Sign In | Social Connect"
          description="Sign In | Social Connect"
        />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign In
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">
                Username Or Email Address
              </InputLabel>
              <Input name="username" type="text" onChange={this.handleChange} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
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
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <br />
          <br />
          {/* Error Snackbar */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              open={openError}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 2,
  },
  snack: {
    color: theme.palette.protectedTitle,
  },
});

Signin.getInitialProps = checkLoggedInUser();

export default withStyles(styles)(Signin);
