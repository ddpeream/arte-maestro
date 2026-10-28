import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createArtistStat,
  updateArtistStat,
  publishArtistStat,
  archiveArtistStat,
  restoreArtistStat,
} from "./artistStatsService";

// Refresca todas las consultas relacionadas con artistas.
function useInvalidateArtists() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["artists"],
    });
}

// Crea una cifra nueva como borrador.
export function useCreateArtistStatMutation() {
  const invalidateArtists = useInvalidateArtists();

  return useMutation({
    mutationFn: createArtistStat,
    onSuccess: invalidateArtists,
  });
}

// Actualiza una cifra existente.
export function useUpdateArtistStatMutation() {
  const invalidateArtists = useInvalidateArtists();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtistStat(id, changes),

    onSuccess: invalidateArtists,
  });
}

// Publica una cifra.
export function usePublishArtistStatMutation() {
  const invalidateArtists = useInvalidateArtists();

  return useMutation({
    mutationFn: publishArtistStat,
    onSuccess: invalidateArtists,
  });
}

// Archiva una cifra publicada.
export function useArchiveArtistStatMutation() {
  const invalidateArtists = useInvalidateArtists();

  return useMutation({
    mutationFn: archiveArtistStat,
    onSuccess: invalidateArtists,
  });
}

// Recupera una cifra archivada y la devuelve a borrador.
export function useRestoreArtistStatMutation() {
  const invalidateArtists = useInvalidateArtists();

  return useMutation({
    mutationFn: restoreArtistStat,
    onSuccess: invalidateArtists,
  });
}
