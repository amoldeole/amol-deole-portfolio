import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Users,
  X
} from 'lucide-react';
import { useCall } from '../../../app/providers/CallContext';

const CallWindow: React.FC = () => {
  const { 
    state, 
    answerCall, 
    declineCall, 
    endCall, 
    toggleVideo, 
    toggleAudio, 
    toggleSpeaker, 
    hideCallWindow 
  } = useCall();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.activeCall?.status === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.activeCall?.status]);

  useEffect(() => {
    // Set up local video stream
    if (state.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = state.localStream;
    }
  }, [state.localStream]);

  useEffect(() => {
    // Set up remote video stream
    if (state.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = state.remoteStream;
    }
  }, [state.remoteStream]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getParticipantName = (call: any) => {
    if (call.type === 'group') {
      return `Group Call (${call.participants.length})`;
    }
    return `${call.initiator.firstName} ${call.initiator.lastName}`;
  };

  const currentCall = state.activeCall || state.incomingCall;

  if (!currentCall || !state.isCallWindowVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed inset-0 z-50 bg-gray-900 flex flex-col ${
          isFullscreen ? '' : 'rounded-lg m-4'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-black bg-opacity-50 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentCall.initiator.firstName.charAt(0)}{currentCall.initiator.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{getParticipantName(currentCall)}</p>
                <p className="text-sm text-gray-300">
                  {state.incomingCall ? 'Incoming call...' : 
                   currentCall.status === 'pending' ? 'Calling...' : 
                   currentCall.status === 'active' ? formatDuration(callDuration) : 
                   currentCall.status}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentCall.participants.length > 2 && (
                <div className="flex items-center space-x-1 text-sm">
                  <Users size={16} />
                  <span>{currentCall.participants.length}</span>
                </div>
              )}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
              <button
                onClick={hideCallWindow}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-gray-800">
          {currentCall.type === 'video' ? (
            <>
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
              
              {/* Local Video */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            </>
          ) : (
            /* Audio Call UI */
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-4xl mx-auto mb-4">
                  {currentCall.initiator.firstName.charAt(0)}{currentCall.initiator.lastName.charAt(0)}
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {getParticipantName(currentCall)}
                </h3>
                <p className="text-gray-300">
                  {state.incomingCall ? 'Incoming call...' : 
                   currentCall.status === 'pending' ? 'Calling...' : 
                   currentCall.status === 'active' ? formatDuration(callDuration) : 
                   currentCall.status}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-black bg-opacity-50">
          <div className="flex items-center justify-center space-x-6">
            {/* Audio Toggle */}
            {!state.incomingCall && (
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full ${
                  state.isAudioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors`}
              >
                {state.isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
            )}

            {/* Video Toggle (only for video calls) */}
            {currentCall.type === 'video' && !state.incomingCall && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${
                  state.isVideoEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                } text-white transition-colors`}
              >
                {state.isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
            )}

            {/* Speaker Toggle */}
            {!state.incomingCall && (
              <button
                onClick={toggleSpeaker}
                className={`p-4 rounded-full ${
                  state.isSpeakerEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white transition-colors`}
              >
                {state.isSpeakerEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            )}

            {/* Call Actions */}
            {state.incomingCall ? (
              <>
                <button
                  onClick={answerCall}
                  className="p-4 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <Phone size={24} />
                </button>
                <button
                  onClick={declineCall}
                  className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <PhoneOff size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <PhoneOff size={24} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CallWindow;