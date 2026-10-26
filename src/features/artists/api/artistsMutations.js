import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  archiveArtist,
  createArtist,
  publishArtist,
  updateArtist,
} from "./artistsService";

// Crea un artista y refresca las consultas de artistas.
export function useCreateArtistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
    },
  });
}

// Actualiza un artista y refresca sus datos.
export function useUpdateArtistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }) => updateArtist(id, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
    },
  });
}

// Publica un artista y actualiza el catálogo público.
export function usePublishArtistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
    },
  });
}

// Archiva un artista y lo retira del catálogo público.
export function useArchiveArtistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveArtist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["artists"],
      });
    },
  });
}
