import React, { createContext, useContext, useState, useCallback } from 'react';
import { socketService } from '../../shared/services/socket.service';
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

  const initiateCall = useCallback((participants: User[], type: 'voice' | 'video', chatId?: string) => {
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
    socketService.initiateCall(participantIds, type, chatId);
  }, []);

  const answerCall = useCallback(() => {
    if (state.incomingCall) {
      setState(prev => ({
        ...prev,
        activeCall: prev.incomingCall,
        incomingCall: null,
        isCallWindowVisible: true
      }));

      socketService.answerCall(state.incomingCall._id);
    }
  }, [state.incomingCall]);

  const declineCall = useCallback(() => {
    if (state.incomingCall) {
      socketService.declineCall(state.incomingCall._id);
      setState(prev => ({
        ...prev,
        incomingCall: null
      }));
    }
  }, [state.incomingCall]);

  const endCall = useCallback(() => {
    if (state.activeCall) {
      socketService.endCall(state.activeCall._id);
      
      // Clean up streams
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      
      setState(prev => ({
        ...prev,
        activeCall: null,
        isCallWindowVisible: false,
        localStream: null,
        remoteStream: null,
        callDuration: 0
      }));
    }
  }, [state.activeCall, state.localStream]);

  const toggleVideo = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));

    // Toggle video track
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !state.isVideoEnabled;
      }
    }
  }, [state.isVideoEnabled, state.localStream]);

  const toggleAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAudioEnabled: !prev.isAudioEnabled
    }));

    // Toggle audio track
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !state.isAudioEnabled;
      }
    }
  }, [state.isAudioEnabled, state.localStream]);

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

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
