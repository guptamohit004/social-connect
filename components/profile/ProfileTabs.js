import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Post from "../../components/index/Post";
import FollowTab from "../../components/profile/FollowTab";

class ProfileTabs extends React.Component {
  state = {
    tab: 0
  };

  handleTabChange = (event, value) => {
    this.setState({ tab: value });
  };

  render() {
    const { tab } = this.state;
    const {
      posts,
      user,
      auth,
      isDeletingPost,
      handleDeletePost,
      handleToggleLike,
      handleAddComment,
      handleDeleteComment
    } = this.props;
    const PostsLength = `Posts  (${posts.length})`;
    const FollowingLength = `Following  (${user.following.length})`;
    const FollowersLength = `Followers  (${user.followers.length})`;
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            fullWidth
          >
            <Tab label={PostsLength}/>
            <Tab label={FollowingLength} />
            <Tab label={FollowersLength} />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <TabContainer>
            {posts.map(post => (
              <Post
                key={post._id}
                auth={auth}
                post={post}
                isDeletingPost={isDeletingPost}
                handleDeletePost={handleDeletePost}
                handleToggleLike={handleToggleLike}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </TabContainer>
        )}
        {tab === 1 && (
          <TabContainer>
          {user.following.length>0 ? <FollowTab users={user.following} /> : <Typography style={{ padding: "1em" }}> User do not Follow anyone. </Typography>}
          </TabContainer>
        )}
        {tab === 2 && (
          <TabContainer>
            {user.followers.length>0 ? <FollowTab users={user.followers} /> : <Typography style={{ padding: "1em" }}> User is not followed by anyone. </Typography>}
          </TabContainer>
        )}
      </div>
    );
  }
}

const TabContainer = ({ children }) => (
  <Typography component="div" style={{ padding: "1em" }}>
    {children}
  </Typography>
);

export default ProfileTabs;
