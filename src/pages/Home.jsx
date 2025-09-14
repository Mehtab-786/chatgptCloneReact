import { lazy, Suspense } from "react";
import React, { useCallback, useEffect } from "react";
const ChatMobileBar = lazy(() =>
  import("../components/chat/ChatMobileBar.jsx")
);
const ChatSidebar = lazy(() => import("../components/chat/ChatSidebar.jsx"));
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import "../components/chat/ChatLayout.css";
import { useDispatch, useSelector } from "react-redux";
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  deleteChatTitle,
} from "../store/chatSlice.js";
import generateContent from "../services/ai.services.js";
import { useAuthUser } from "../services/currentUser.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const input = useSelector((state) => state.chat.input);
  const isSending = useSelector((state) => state.chat.isSending);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  const handleNewChat = useCallback(() => {
    // Prompt user for title of new chat, fallback to 'New Chat'
    let title = window.prompt("Enter a title for the new chat:", "");
    if (title) title = title.trim();
    if (!title) return;
    dispatch(startNewChat(title));
    setSidebarOpen(false);
  }, [dispatch]);

  // Ensure at least one chat exists initially
  // useEffect(() => {
  //   dispatch(ensureInitialChat());
  // }, [dispatch]);

  const { loading, user } = useAuthUser();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    localStorage.setItem("allChats", JSON.stringify(chats));
  }, [chats, addUserMessage, addAIMessage, activeChatId, deleteChatTitle]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());
    dispatch(addUserMessage(activeChatId, trimmed));
    dispatch(setInput(""));
    try {
      const reply = await generateContent(trimmed);
      dispatch(addAIMessage(activeChatId, reply));
    } catch {
      dispatch(addAIMessage(activeChatId, "Error fetching AI response.", true));
    } finally {
      dispatch(sendingFinished());
    }
  }, [input, activeChatId, isSending, dispatch]);

  return (
    <div className="chat-layout minimal">
      <Suspense fallback={<div className="loading-fallback">Loading chat…</div>}>
        <ChatMobileBar
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onNewChat={handleNewChat}
        />

        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            dispatch(selectChat(id));
            setSidebarOpen(false);
          }}
          onDeleteChat={(id) => {
            dispatch(deleteChatTitle(id));
          }}
          onNewChat={handleNewChat}
          open={sidebarOpen}
        />

        <main className="chat-main" role="main">
          {messages.length === 0 && (
            <div className="chat-welcome" aria-hidden="true">
              <h1>ChatGPT Clone</h1>
              <p className="homepage-title">
                A side project inspired by ChatGPT <br />
                Ask anything. Paste text, brainstorm ideas, or get quick
                explanations.
              </p>
              <p>
                💡 Click on a chat in the sidebar or start a new one to begin.
              </p>
            </div>
          )}
          <ChatMessages messages={messages} isSending={isSending} />

          {activeChat && (
            <ChatComposer
              input={input}
              setInput={(v) => dispatch(setInput(v))}
              onSend={sendMessage}
              isSending={isSending}
            />
          )}
        </main>

        {sidebarOpen && (
          <button
            className="sidebar-backdrop"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Home;
