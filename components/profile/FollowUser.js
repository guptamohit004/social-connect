import Button from "@material-ui/core/Button";
import  {followUser, UnfollowUser} from '../../lib/data'

const FollowUser = ({isFollowing,isFollower,toggleFollow}) => {
  const request = isFollowing ? UnfollowUser : followUser;
  return (
    <Button
      variant="contained"
      color="primary"
      onClick = {() => toggleFollow(request)}
    >
    {isFollower && !isFollowing ? "Follow Back" : isFollowing ? "Unfollow" : "Follow" }
    </Button>
  )
};

export default FollowUser;
