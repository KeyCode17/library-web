// The catalog list's API surface — the book resource lives in the shared module
// (#/libs/api/books.ts) because the detail feature consumes the same resource and
// must share its cache keys.

export type { TBook, TBookList, TListBooksParams, TPagination } from "#/libs/api/books.ts"
export { bookKeys, listBooks } from "#/libs/api/books.ts"
