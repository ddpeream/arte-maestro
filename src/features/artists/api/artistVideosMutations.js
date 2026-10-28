import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistVideo,
  updateArtistVideo,
  publishArtistVideo,
  archiveArtistVideo,
  restoreArtistVideo,
} from "./artistVideosService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistVideoMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistVideo,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistVideoMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistVideo(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistVideoMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistVideo,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistVideoMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistVideo,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistVideoMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistVideo,
    onSuccess: invalidateArtists,
  });
}
