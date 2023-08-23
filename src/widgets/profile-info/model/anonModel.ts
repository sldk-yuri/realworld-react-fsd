import { attachOperation } from '@farfetched/core';
import { Store, createEvent, sample } from 'effector';
import { profileApi } from '~entities/profile';

type AnonConfig = {
  $username: Store<string | null>;
};

export type AnonModel = ReturnType<typeof createAnonModel>;

export function createAnonModel(config: AnonConfig) {
  const { $username } = config;

  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();

  const profileQuery = attachOperation(profileApi.profileQuery);

  sample({
    clock: init,
    source: $username,
    filter: Boolean,
    fn: (username) => ({ username }),
    target: profileQuery.start,
  });

  sample({
    clock: reset,
    target: profileQuery.reset,
  });

  sample({
    clock: unmounted,
    target: reset,
  });

  const $profile = profileQuery.$data;
  const { $pending } = profileQuery;
  const { $error } = profileQuery;

  return {
    init,
    unmounted,
    reset,
    $profile,
    $pending,
    $error,
  };
}
