import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShareOutlined from "@material-ui/icons/ShareOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import ActiveLink from './ActiveLink';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import { useRouter } from 'next/router'
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {signoutUser} from '../../lib/auth';
import Notifications from './notification';

const Navbar = ({classes, router,pageProps:{auth}}) => {
  const route = useRouter()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const redirectuser = (event,href)=>{
    event.preventDefault();
    router.push(href);
  }
  const {user = {} } = auth || {};
  return (
    <AppBar
      className={classes.appBar}
      position={router.pathname === "/" ? "fixed" : "static"}
    >
      <Toolbar>
        {/* Main Title / Home Button */}
        <ShareOutlined className={classes.icon} />
        <Typography
          variant="h5"
          component="h1"
          className={classes.toolbarTitle}
        >
        <ActiveLink href='/'>Social Connect</ActiveLink>
        </Typography>
        {user._id ? (
          <div>
            <Notifications/>
            <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
          <Avatar alt={user.name} src={user.avatar} />
          </IconButton>
          <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={(e)=> redirectuser(e,`/profile/${user.username}`)}>Profile</MenuItem>
          <MenuItem onClick={(e)=> redirectuser(e,'/edit-profile')}>Edit Profle</MenuItem>
          <MenuItem onClick={(e)=> redirectuser(e,'/')}>Settings</MenuItem>
          <Divider/>
          <MenuItem onClick={signoutUser}>Logout</MenuItem>
        </Menu>
          </div>
        ) : (
          // UnAuth Navigation
          <div>
            <Button>
              <ActiveLink href="/signin">Sign in</ActiveLink>
            </Button>
            <Button>
              <ActiveLink href="/signup">Sign up</ActiveLink>
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
    )
};

const styles = theme => ({
  appBar: {
    // z-index 1 higher than the fixed drawer in home page to clip it under the navigation
    zIndex: theme.zIndex.drawer + 1
  },
  toolbarTitle: {
    flex: 1
  },
  icon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(Navbar);
