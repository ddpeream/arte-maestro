import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistPress,
  updateArtistPress,
  publishArtistPress,
  archiveArtistPress,
  restoreArtistPress,
} from "./artistPressService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistPressMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistPress,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistPressMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistPress(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistPressMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistPress,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistPressMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistPress,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistPressMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistPress,
    onSuccess: invalidateArtists,
  });
}
