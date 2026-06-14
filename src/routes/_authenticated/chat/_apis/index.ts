// The chat feature's API surface — history lives in the shared module
// (#/libs/api/chat.ts); the live socket lives in #/libs/chat/chat-socket.ts.

export type { TChatMessage, TChatMessageList } from "#/libs/api/chat.ts"
export { chatHistory, chatKeys } from "#/libs/api/chat.ts"
