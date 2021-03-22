import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import moment from 'moment';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { NextSeo } from 'next-seo';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AccountBox from "@material-ui/icons/AccountBox";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import { authInitialProps,getAllSessions } from "../lib/auth";
import Tooltip from '@material-ui/core/Tooltip';
import Link from "next/link";
import {signOutUsersession} from "../lib/auth";

class Sessions extends React.Component {
    state={
      data:[]
    }
    componentDidMount(){
        getAllSessions().then(data=>{
            this.setState({data:data.data.reverse()});
        }).catch(err=>{
            console.log(err);
        })
    }
    signoutUser(id){
      signOutUsersession(id).then((data)=>{
        console.log(data);
        alert("Logged out of the Session");
        const filteredData = this.state.data.filter((item) => item.id !== id);
        this.setState({data: filteredData});
      }).catch((err)=>{
        console.log(err);
        alert("not logged out of the session");
      })
    }
  render() {
    const { classes } = this.props;
    const { data } = this.state;
    return(
    <Paper className={classes.root} elevation={8}>
    <NextSeo
          title={`${this.props.auth.user.name} @(${this.props.auth.user.username})  Logged in Sessions `}
          description={`${this.props.auth.user.name} @(${this.props.auth.user.username})  Logged in Sessions on Social Connect`}
      />
      <Typography
      variant="h4"
      component="h1"
      align="center"
      className={classes.title}
      gutterBottom
    >
      Current Sessions you are Logged in
    </Typography>
    <List>
    {data.map((user, i) => (
      <span key={user._id}>
        <ListItem>
          <ListItemAvatar>
            <LocationCityIcon/>
          </ListItemAvatar>
          <Tooltip title={`IP - ${user.ip}`} placement="top-start">
            <ListItemText
            primary={`${user.city}, ${user.regionName}, ${user.country}`}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="#58c322"
                >
                {`${user.osinfo}  ${user.device==' ' ? '':' | ' } ${user.device}`}
                </Typography>
                {`Auto logouts on-`}
                <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="#58c322"
              >
              {`${moment(user.expires).format("LL")} in (${moment(user.expires).diff(new Date(),'days')} Days)`}
              </Typography>
              </React.Fragment>
            }
            />
            </Tooltip>
          <ListItemSecondaryAction  className={classes.follow}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.signoutUser(user.id)}
            >
              Logout
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider variant="inset" component="li" />
      </span>
    ))}
  </List>
    </Paper>
    )
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 900
    }
  },
  inline:{
    color:'#58c322'
  },
  title: {
    color: theme.palette.primary.main
  },
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

Sessions.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Sessions);
