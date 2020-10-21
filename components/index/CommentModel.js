import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import Comment from "@material-ui/icons/Comment";
import Badge from "@material-ui/core/Badge";
import Comments from "./Comments";

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
        <IconButton onClick={handleClickOpen('paper')} className={props.classes.button}>
        <Badge badgeContent={props.comments.length} color="primary">
            <Comment className={props.classes.commentIcon} />
        </Badge>
        </IconButton>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">All Comments on Post.</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <Comments
            auth={props.auth}
            postId={props.postId}
            comments={props.comments}
            handleAddComment={props.handleAddComment}
            isFromPopup={'1'}
            handleDeleteComment={props.handleDeleteComment}
          />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
