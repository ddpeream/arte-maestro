import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistRelease,
  updateArtistRelease,
  publishArtistRelease,
  archiveArtistRelease,
  restoreArtistRelease,
} from "./artistReleasesService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistReleaseMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistRelease,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistReleaseMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistRelease(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistReleaseMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistRelease,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistReleaseMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistRelease,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistReleaseMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistRelease,
    onSuccess: invalidateArtists,
  });
}
