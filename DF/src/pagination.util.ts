// Shared pagination cap for ERD list endpoints, which previously had no
// enforced limit — a single request (with or without a filter) could return
// an entire table plus its nested child relations. Applied at each ERD
// service's findMany/findAllmethod call sites.
export const MAX_PAGE_SIZE = 200;

// Caps a caller-supplied `take`/`limit` value; falls back to the cap itself
// when the caller didn't ask for a specific size at all.
export function capTake(take: any): number {
  const n = Number(take);
  if (!n || n <= 0) return MAX_PAGE_SIZE;
  return Math.min(n, MAX_PAGE_SIZE);
}
