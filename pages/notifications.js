import React, { Component, Fragment } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import withStyles from "@material-ui/core/styles/withStyles";
import ImageIcon from "@material-ui/icons/Image";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Avatar from "@material-ui/core/Avatar";
// MUI stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";
import Divider from "@material-ui/core/Divider";

import { authInitialProps } from "../lib/auth";
import { fetchNotifications, markReadNotification } from "../lib/data";
import Router from "next/router";

class Notifications extends React.Component {
  state = {
    anchorEl: null,
    notifications: [],
    unread: 0,
  };
  componentDidMount() {
    fetchNotifications()
      .then((data) => {
        this.setState({ notifications: data });
        var unread = data.filter((not) => not.read === false).length;
        this.setState({ unread: unread });
      })
      .catch(() => {
        this.setState({ notifications: [] });
        this.setState({ unread: 0 });
      });
  }
  handleClick = (event, linkTo) => {
    event.preventDefault();
    Router.push(linkTo);
  };
  handleOpen = (event) => {
    this.setState({ anchorEl: event.target });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    this.setState({ unread: null });
    markReadNotification();
  };
  render() {
    const { classes } = this.props;
    const notifications = this.state.notifications;
    const anchorEl = this.state.anchorEl;

    dayjs.extend(relativeTime);

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
      notifications.filter((not) => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge badgeContent={this.state.unread} color="secondary">
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationsIcon = <NotificationsIcon />);
    } else {
      notificationsIcon = <NotificationsIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map((not) => {
          const verb =
            not.type === "like"
              ? "Liked your post"
              : not.type === "follow"
              ? "Started following you"
              : "Commented on your post";
          const title = `${not.sender.name} @${not.sender.username}`;
          if (not.type === "comment")
            var time = `(${dayjs(not.createdAt).fromNow()})`;
          else var time = ` ${verb} (${dayjs(not.createdAt).fromNow()})`;
          var linkTo = `/profile/${not.sender.username}`;
          return (
            <List
              key={not.createdAt}
              onClick={(e) => {
                this.handleClick(e, linkTo);
              }}
              style={{ cursor: "pointer" }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={not.sender.avatar}
                    className={classes.bigAvatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  className={classes.text}
                  primary={title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="#58c322"
                      >
                        {not.type == "comment" ? `${verb}:` : ""}
                      </Typography>
                      {not.text}
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="#58c322"
                      >
                        {time}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    {not.type != "follow" && not.image ? (
                      <Avatar
                        variant="square"
                        src={not.image}
                        className={classes.smallAvatar}
                      />
                    ) : (
                      ""
                    )}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return <Fragment>{notificationsMarkup}</Fragment>;
  }
}

const styles = (theme) => ({
  root: {
    width: "200%",
    backgroundColor: theme.palette.background.paper,
  },
  menu: {
    width: "100%",
  },
  bigAvatar: {
    width: 40,
    height: 40,
  },
  smallAvatar: {
    width: 50,
    height: 50,
  },
  text: {
    width: "300px",
    "white-space": "initial",
  },
});

Notifications.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Notifications);
