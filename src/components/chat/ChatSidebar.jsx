import ThemeToggle from '../ThemeToggle';
import "./ThemeToggle.css";
import './ChatSidebar.css';
import auth from '../../services/auth.services'
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open, onDeleteChat }) => {

  const navigate = useNavigate()

  async function logOut(){
    await signOut(auth)
    navigate('/login');     
  }
  
  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <button
            key={c.id}
            className={"chat-list-item " + (c.id === activeChatId ? 'active' : '')}
            onClick={() => onSelectChat(c.id)}
          >
            <i onClick={() => onDeleteChat(c.id)} className="ri-delete-bin-6-line delete-btn"></i>
            <span className="title-line">{c.title}</span>
            <span className="meta-line">{c.messages.length} msg{c.messages.length !== 1 && 's'}</span>
          </button>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>
      <div className='mode-logout'>
        <ThemeToggle />
        <button onClick={logOut} className='logout-btn'>Logout</button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
