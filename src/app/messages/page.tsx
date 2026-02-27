
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, doc, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Loader2, User, Search } from 'lucide-react';
import { format } from 'date-fns';
import { type ChatRoom, type ChatMessage } from '@/lib/data';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

const translations = {
  en: {
    title: 'Messages',
    noConversations: 'No conversations yet.',
    typeMessage: 'Type a message...',
    send: 'Send',
    selectChat: 'Select a conversation to start chatting.',
    searchPlaceholder: 'Search messages...',
    loading: 'Loading messages...',
  },
  mr: {
    title: 'संदेश',
    noConversations: 'अद्याप कोणतेही संभाषण नाही.',
    typeMessage: 'संदेश टाइप करा...',
    send: 'पाठवा',
    selectChat: 'चॅटिंग सुरू करण्यासाठी संभाषण निवडा.',
    searchPlaceholder: 'संदेश शोधा...',
    loading: 'संदेश लोड होत आहेत...',
  }
};

export default function MessagesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Query for chat rooms where the user is a participant
  const roomsQuery = useMemoFirebase(
    () => user ? query(collection(firestore, 'chatRooms'), where('participants', 'array-contains', user.uid), orderBy('lastMessageTimestamp', 'desc')) : null,
    [firestore, user]
  );
  
  const { data: rooms, isLoading: isLoadingRooms } = useCollection<ChatRoom>(roomsQuery);

  // Query for messages in the selected room
  const messagesQuery = useMemoFirebase(
    () => selectedRoomId ? query(collection(firestore, 'chatRooms', selectedRoomId, 'messages'), orderBy('timestamp', 'asc'), limit(50)) : null,
    [firestore, selectedRoomId]
  );

  const { data: messages, isLoading: isLoadingMessages } = useCollection<ChatMessage>(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoomId || !newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    const messageData: Omit<ChatMessage, 'id'> = {
      senderId: user.uid,
      senderName: user.displayName || 'User',
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    // Add message to subcollection
    const messagesRef = collection(firestore, 'chatRooms', selectedRoomId, 'messages');
    addDocumentNonBlocking(messagesRef, messageData);

    // Update room with last message
    const roomRef = doc(firestore, 'chatRooms', selectedRoomId);
    setDocumentNonBlocking(roomRef, {
      lastMessage: messageText,
      lastMessageTimestamp: messageData.timestamp,
    }, { merge: true });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-4">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl font-bold font-headline mb-2">Please log in to view messages.</h2>
      </div>
    );
  }

  const selectedRoom = rooms?.find(r => r.id === selectedRoomId);
  const otherParticipantName = selectedRoom ? Object.entries(selectedRoom.participantNames).find(([id]) => id !== user.uid)?.[1] : '';

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-1 gap-6 overflow-hidden bg-background rounded-xl border shadow-sm">
        
        {/* Sidebar: Chat List */}
        <div className={cn("w-full md:w-80 flex flex-col border-r h-full", selectedRoomId && "hidden md:flex")}>
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold font-headline mb-4">{t.title}</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 h-9" placeholder={t.searchPlaceholder} />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {isLoadingRooms ? (
              <div className="p-4 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : rooms?.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground text-sm">{t.noConversations}</p>
            ) : (
              <div className="divide-y">
                {rooms?.map((room) => {
                  const otherName = Object.entries(room.participantNames).find(([id]) => id !== user.uid)?.[1] || 'User';
                  return (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors text-left",
                        selectedRoomId === room.id && "bg-muted"
                      )}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-bold text-sm truncate">{otherName}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {room.lastMessageTimestamp && format(new Date(room.lastMessageTimestamp), 'HH:mm')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{room.lastMessage}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main: Chat Window */}
        <div className={cn("flex-1 flex flex-col h-full", !selectedRoomId && "hidden md:flex")}>
          {selectedRoomId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSelectedRoomId(null)}>
                  <Search className="h-5 w-5 rotate-90" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-bold text-sm leading-none">{otherParticipantName}</h2>
                  <span className="text-[10px] text-green-500 font-medium">Online</span>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 bg-muted/10">
                <div className="space-y-4">
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : messages?.map((msg) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                      <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                        <div className={cn(
                          "px-4 py-2 rounded-2xl text-sm shadow-sm",
                          isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none border"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {format(new Date(msg.timestamp), 'p')}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t.typeMessage}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <MessageSquare className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold font-headline mb-2">{t.title}</h3>
              <p className="max-w-xs text-sm">{t.selectChat}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
