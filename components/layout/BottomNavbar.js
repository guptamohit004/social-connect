import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import DnsIcon from '@material-ui/icons/Dns';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PersonIcon from '@material-ui/icons/Person';
import { withRouter } from "next/router";


const Simple = ({classes, router,pageProps:{auth}}) => {
  const [value, setValue] = React.useState(0);
  const {user = {} } = auth || {};
  return (
    <div>
    {user._id ? (
            <BottomNavigation
              value={value}
              onChange={(event, newValue) => {
                router.push(newValue);
                setValue(newValue);
              }}
              className={classes.root}
              showLabels className={classes.root}>
            <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
            <BottomNavigationAction label="Notifications" value="/notifications" icon={<NotificationsIcon />} />
            <BottomNavigationAction label="Your Profile" value={`/profile/${user.username}`} icon={<PersonIcon />} />
            <BottomNavigationAction label="Sessions" value={`/sessions`} icon={<DnsIcon />} />
          </BottomNavigation>
  ) : (
      <BottomNavigation value={value}
      onChange={(event, newValue) => {
        router.push(newValue);
        setValue(newValue);
      }}
      showLabels className={classes.root}>
        <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="Sign In" value="/signin" icon={<LockIcon />} />
        <BottomNavigationAction label="Sign Up" value="/signup" icon={<LockOpenIcon />} />
      </BottomNavigation>
  )}
  </div>
    )
};

const styles = theme => ({
  root: {
    'z-index':1,
    position: "fixed",
    width: "100vw",
    bottom: 0,
    'justify-content': "center"
  },
});

export default withStyles(styles)(Simple);
