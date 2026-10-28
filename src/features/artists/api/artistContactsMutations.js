import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistContact,
  updateArtistContact,
  publishArtistContact,
  archiveArtistContact,
  restoreArtistContact,
  setPrimaryArtistContact,
  clearPrimaryArtistContact,
} from "./artistContactsService";

function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

export function useCreateArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistContact,
    onSuccess: invalidateArtists,
  });
}

export function useUpdateArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistContact(id, changes),

    onSuccess: invalidateArtists,
  });
}

export function usePublishArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistContact,
    onSuccess: invalidateArtists,
  });
}

export function useArchiveArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistContact,
    onSuccess: invalidateArtists,
  });
}

export function useRestoreArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistContact,
    onSuccess: invalidateArtists,
  });
}

export function useSetPrimaryArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: setPrimaryArtistContact,
    onSuccess: invalidateArtists,
  });
}

export function useClearPrimaryArtistContactMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: clearPrimaryArtistContact,
    onSuccess: invalidateArtists,
  });
}
