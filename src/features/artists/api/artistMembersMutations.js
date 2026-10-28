import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistMember,
  updateArtistMember,
  publishArtistMember,
  archiveArtistMember,
  restoreArtistMember,
} from "./artistMembersService";

// Invalida toda la familia de consultas de artistas.
function useArtistsInvalidation() {
  const queryClient = useQueryClient();

  return async function invalidateArtists() {
    await queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
  };
}

// Crea un integrante.
export function useCreateArtistMemberMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: createArtistMember,
    onSuccess: invalidateArtists,
  });
}

// Actualiza un integrante.
export function useUpdateArtistMemberMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistMember(id, changes),

    onSuccess: invalidateArtists,
  });
}

// Publica un integrante.
export function usePublishArtistMemberMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: publishArtistMember,
    onSuccess: invalidateArtists,
  });
}

// Archiva un integrante.
export function useArchiveArtistMemberMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: archiveArtistMember,
    onSuccess: invalidateArtists,
  });
}

// Recupera un integrante archivado.
export function useRestoreArtistMemberMutation() {
  const invalidateArtists = useArtistsInvalidation();

  return useMutation({
    mutationFn: restoreArtistMember,
    onSuccess: invalidateArtists,
  });
}
