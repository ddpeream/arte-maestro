import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistLink,
  updateArtistLink,
  publishArtistLink,
  archiveArtistLink,
  restoreArtistLink,
} from "./artistLinksService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistLinkMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistLink,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistLinkMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistLink(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistLinkMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistLink,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistLinkMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistLink,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistLinkMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistLink,
    onSuccess: invalidateArtists,
  });
}
