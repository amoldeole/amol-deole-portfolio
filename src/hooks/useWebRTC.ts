import { useState, useRef } from 'react';

export const useWebRTC = (chatId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'connected'>('idle');
  const [isVideoCall, setIsVideoCall] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const startCall = async (video: boolean = false) => {
    try {
      setIsVideoCall(video);
      setCallStatus('calling');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate call connection after 2 seconds
      setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
      
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('idle');
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStreams([]);
    setCallStatus('idle');
    setIsVideoCall(false);
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  return {
    localStream,
    remoteStreams,
    callStatus,
    isVideoCall,
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio
  };
};