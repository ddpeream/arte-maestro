import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistGalleryItem,
  updateArtistGalleryItem,
  publishArtistGalleryItem,
  archiveArtistGalleryItem,
  restoreArtistGalleryItem,
} from "./artistGalleryService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistGalleryItemMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistGalleryItem,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistGalleryItemMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistGalleryItem(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistGalleryItemMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistGalleryItem,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistGalleryItemMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistGalleryItem,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistGalleryItemMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistGalleryItem,
    onSuccess: invalidateArtists,
  });
}
