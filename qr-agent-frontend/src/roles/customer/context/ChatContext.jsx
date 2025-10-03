import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerApi } from '../api/customerApi';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Welcome to our restaurant! How can I assist you today?',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [isFullChatMode, setIsFullChatMode] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [panelData, setPanelData] = useState(null);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text, sender = 'user') => {
    const userMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);

    // Handle triggers
    const lower = text.trim().toLowerCase();
    if (lower === 'cart') {
      const data = await customerApi.getMockCart();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Here's your cart",
          timestamp: new Date().toISOString(),
          type: 'text'
        },
        {
          id: Date.now() + 2,
          sender: 'agent',
          type: 'component',
          componentType: 'cart',
          componentData: data.items
        }
      ]);
      return;
    }
    if (lower === 'menu') {
      const data = await customerApi.getMockMenu();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Here's our menu",
          timestamp: new Date().toISOString(),
          type: 'text'
        },
        {
          id: Date.now() + 2,
          sender: 'agent',
          type: 'component',
          componentType: 'menu',
          componentData: data
        }
      ]);
      return;
    }
    if (lower === 'orders') {
      const data = await customerApi.getMockOrders();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Here are your orders",
          timestamp: new Date().toISOString(),
          type: 'text'
        },
        {
          id: Date.now() + 2,
          sender: 'agent',
          type: 'component',
          componentType: 'orders',
          componentData: data
        }
      ]);
      return;
    }
    if (lower === 'payment') {
      const data = await customerApi.getMockPayment();
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Here are your payment details",
          timestamp: new Date().toISOString(),
          type: 'text'
        },
        {
          id: Date.now() + 2,
          sender: 'agent',
          type: 'component',
          componentType: 'payment',
          componentData: data
        }
      ]);
      return;
    }

    // Default agent response
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'agent',
        text: "Thanks for your message!",
        timestamp: new Date().toISOString(),
        type: 'text'
      }
    ]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'agent',
        text: 'Welcome to our restaurant! How can I assist you today?',
        timestamp: new Date().toISOString(),
        type: 'text'
      }
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChat,
        isFullChatMode,
        toggleChatMode: () => setIsFullChatMode((prev) => !prev),
        activePanel,
        setActivePanel,
        panelData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};