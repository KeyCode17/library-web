// The detail feature's API surface — the book resource (and its shared cache
// keys) lives in #/libs/api/books.ts, consumed by both the list and detail.

export type { TBook } from "#/libs/api/books.ts"
export { bookKeys, getBook } from "#/libs/api/books.ts"
