import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatNavbar from '../components/ChatInterface/ChatNavbar';
import MessageBubble from '../components/ChatInterface/MessageBubble';
import InputSection from '../components/ChatInterface/InputSection';
import MenuCarousel from '../components/ChatInterface/MenuCarousel';
import CartDetailsList from '../components/ChatInterface/CartDetailsList';
import OrderedItemsList from '../components/ChatInterface/OrderedItemsList';
import PaymentDetails from '../components/ChatInterface/PaymentDetails';
import { useChat } from '../context/ChatContext';

const ChatPage = () => {
  const { messages, sendMessage } = useChat();
  const chatEndRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Render component message as a bubble
  const renderComponentBubble = (message) => {
    switch (message.componentType) {
      case 'menu':
        return (
          <div key={message.id} className="flex justify-start mb-3">
            <MenuCarousel items={message.componentData} title="Menu" />
          </div>
        );
      case 'cart':
        return (
          <div key={message.id} className="flex justify-start mb-3">
            <CartDetailsList items={message.componentData} />
          </div>
        );
      case 'orders':
        return (
          <div key={message.id} className="flex justify-start mb-3">
            <OrderedItemsList items={message.componentData} />
          </div>
        );
      case 'payment':
        return (
          <div key={message.id} className="flex justify-start mb-3">
            <PaymentDetails
              total={message.componentData?.total || 0}
              tax={message.componentData?.tax || 0}
              grandTotal={message.componentData?.grandTotal || 0}
              onPay={() => alert('Payment Initiated')}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div className="flex flex-col h-screen">
      {/* Chat Navbar */}
      <ChatNavbar />

      {/* Chat Interface */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) =>
          message.type === 'component'
            ? renderComponentBubble(message)
            : <MessageBubble key={message.id} message={message} />
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <InputSection onSendMessage={sendMessage} />
    </motion.div>
  );
};

export default ChatPage;