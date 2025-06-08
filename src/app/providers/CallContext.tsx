import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { Call, User } from '../../shared/types';

interface CallState {
  activeCall: Call | null;
  incomingCall: Call | null;
  isCallWindowVisible: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isSpeakerEnabled: boolean;
  callDuration: number;
}

interface CallContextType {
  state: CallState;
  initiateCall: (participants: User[], type: 'voice' | 'video', chatId?: string) => void;
  answerCall: () => void;
  declineCall: () => void;
  endCall: () => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleSpeaker: () => void;
  hideCallWindow: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CallState>({
    activeCall: null,
    incomingCall: null,
    isCallWindowVisible: false,
    localStream: null,
    remoteStream: null,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isSpeakerEnabled: false,
    callDuration: 0,
  });

  const socket = useSocket();

  // Setup socket listeners for call events
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: { call: Call; offer?: any }) => {
      setState(prev => ({
        ...prev,
        incomingCall: data.call
      }));
    };

    const handleCallAnswered = (data: { call: Call }) => {
      setState(prev => ({
        ...prev,
        activeCall: data.call,
        incomingCall: null
      }));
    };

    const handleCallDeclined = (data: { userId: string; callId: string }) => {
      setState(prev => ({
        ...prev,
        incomingCall: null,
        activeCall: null,
        isCallWindowVisible: false
      }));
    };

    const handleCallEnded = (data: { callId: string; endedBy: string; call: Call }) => {
      setState(prev => ({
        ...prev,
        activeCall: null,
        incomingCall: null,
        isCallWindowVisible: false,
        localStream: null,
        remoteStream: null,
        callDuration: 0
      }));
    };

    socket.on('incomingCall', handleIncomingCall);
    socket.on('callAnswered', handleCallAnswered);
    socket.on('callDeclined', handleCallDeclined);
    socket.on('callEnded', handleCallEnded);

    return () => {
      socket.off('incomingCall', handleIncomingCall);
      socket.off('callAnswered', handleCallAnswered);
      socket.off('callDeclined', handleCallDeclined);
      socket.off('callEnded', handleCallEnded);
    };
  }, [socket]);

  const initiateCall = useCallback((participants: User[], type: 'voice' | 'video', chatId?: string) => {
    if (!socket) return;

    const participantIds = participants.map(p => p._id);
    
    // Create call object
    const call: Call = {
      _id: `call_${Date.now()}`,
      type,
      initiator: participants[0], // This should be current user
      participants: participants.map(p => ({
        user: p,
        status: 'pending' as const
      })),
      status: 'pending',
      chatId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setState(prev => ({
      ...prev,
      activeCall: call,
      isCallWindowVisible: true,
      isVideoEnabled: type === 'video'
    }));

    // Emit to socket
    socket.initiateCall(participantIds, type, chatId);
  }, [socket]);

  const answerCall = useCallback(() => {
    if (state.incomingCall && socket) {
      setState(prev => ({
        ...prev,
        activeCall: prev.incomingCall,
        incomingCall: null,
        isCallWindowVisible: true
      }));

      socket.answerCall(state.incomingCall._id);
    }
  }, [state.incomingCall, socket]);

  const declineCall = useCallback(() => {
    if (state.incomingCall && socket) {
      socket.declineCall(state.incomingCall._id);
      setState(prev => ({
        ...prev,
        incomingCall: null
      }));
    }
  }, [state.incomingCall, socket]);

  const endCall = useCallback(() => {
    if (state.activeCall && socket) {
      socket.endCall(state.activeCall._id);
      setState(prev => ({
        ...prev,
        activeCall: null,
        incomingCall: null,
        isCallWindowVisible: false,
        localStream: null,
        remoteStream: null,
        callDuration: 0
      }));
    }
  }, [state.activeCall, socket]);

  const toggleVideo = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  }, []);

  const toggleAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAudioEnabled: !prev.isAudioEnabled
    }));
  }, []);

  const toggleSpeaker = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSpeakerEnabled: !prev.isSpeakerEnabled
    }));
  }, []);

  const hideCallWindow = useCallback(() => {
    setState(prev => ({
      ...prev,
      isCallWindowVisible: false
    }));
  }, []);

  const value: CallContextType = {
    state,
    initiateCall,
    answerCall,
    declineCall,
    endCall,
    toggleVideo,
    toggleAudio,
    toggleSpeaker,
    hideCallWindow,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};