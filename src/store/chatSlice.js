import { createSlice, nanoid } from '@reduxjs/toolkit';

// helpers
const createEmptyChat = (title) => ({ id: nanoid(), title: title || 'New Chat', messages: [] });


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        // chats: JSON.parse(localStorage.getItem(`allChats`)) || [],
        chats: [],
        // chats: JSON.parse(localStorage.getItem('allChats')) || [],
        activeChatId: null,
        isSending: false,
        input: ''
    },
    reducers: {
        ensureInitialChat(state) {
            if (state.chats.length === 0) {
                const chat = createEmptyChat();
                state.chats.unshift(chat);
                state.activeChatId = chat.id;
            }
        },
        startNewChat: {
            reducer(state, action) {
                const { id, title } = action.payload;
                state.chats.unshift({ id, title: title || 'New Chat', messages: [] });
                state.activeChatId = id;
            },
            prepare(title) {
                return { payload: { id: nanoid(), title: title || 'New Chat' } };
            }
        },
        selectChat(state, action) {
            state.activeChatId = action.payload;
        },
        setInput(state, action) {
            state.input = action.payload;
        },
        sendingStarted(state) {
            state.isSending = true;
        },
        sendingFinished(state) {
            state.isSending = false;
        },
        addUserMessage: {
            reducer(state, action) {
                const { chatId, message } = action.payload;
                const chat = state.chats.find(c => c.id === chatId);
                if (!chat) return;
                chat.messages.push(message);
            },
            prepare(chatId, content) {
                return { payload: { chatId, message: { id: nanoid(), role: 'user', content, ts: Date.now() } } };
            }
        },
        addAIMessage: {
            reducer(state, action) {
                const { chatId, message } = action.payload;
                const chat = state.chats.find(c => c.id === chatId);
                if (!chat) return;
                chat.messages.push(message);
            },
            prepare(chatId, content, error = false) {
                return { payload: { chatId, message: { id: nanoid(), role: 'ai', content, ts: Date.now(), ...(error ? { error: true } : {}) } } };
            }
        },
        deleteChatTitle(state, action) {
            const id = action.payload;

            state.chats = state.chats.filter(chat => chat.id != id);

            if (state.activeChatId == id) {
                state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null
            };
        },
        loadChats(state, action) {
            state.chats = action.payload
        }
    }
});

export const {
    ensureInitialChat,
    startNewChat,
    selectChat,
    setInput,
    sendingStarted,
    sendingFinished,
    addUserMessage,
    addAIMessage,
    deleteChatTitle,
    loadChats
} = chatSlice.actions;

export default chatSlice.reducer;
