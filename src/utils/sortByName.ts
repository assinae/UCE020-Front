export type SortDirection = 'asc' | 'desc';

/**
 * Ordena por nome com as regras do português: "Álvaro" cai junto de "Alvaro",
 * e maiúsculas não jogam o nome para o fim da lista.
 */
export function sortByName<T extends { name: string }>(
  items: T[],
  direction: SortDirection
): T[] {
  const ordenados = [...items].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );

  return direction === 'asc' ? ordenados : ordenados.reverse();
}
