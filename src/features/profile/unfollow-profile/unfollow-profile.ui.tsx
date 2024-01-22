import { IoRemove } from 'react-icons/io5';
import { profileTypes } from '~entities/profile';
import { Button } from '~shared/ui/button';
import { useUnfollowProfileMutation } from './unfollow-profile.model';

type UnfollowUserButtonProps = { profile: profileTypes.Profile };

export function UnfollowUserButton(props: UnfollowUserButtonProps) {
  const { profile } = props;

  const { mutate: unfollowProfile } = useUnfollowProfileMutation(profile);

  const handleClick = () => {
    unfollowProfile(profile.username);
  };

  return (
    <Button color="secondary" onClick={handleClick}>
      <IoRemove size={16} />
      &nbsp; Unfollow {profile.username}
    </Button>
  );
}