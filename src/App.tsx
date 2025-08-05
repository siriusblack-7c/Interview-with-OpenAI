import './App.css'
import {
  Header,
  Controls,
  StatusIndicators,
  CurrentTranscript,
  Conversation,
  ErrorMessage,
  SetupInstructions,
  InterviewSetup,
  InterviewControls
} from './components'
import { useSpeechRecognition, useConversation, useOpenAI } from './hooks'
import { useState } from 'react'

function App() {
  // File upload state
  const [resumeFileName, setResumeFileName] = useState<string>()
  const [jobDescriptionFileName, setJobDescriptionFileName] = useState<string>()
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)

  // Custom hooks for business logic
  const { conversation, addToConversation, clearConversation: clearConversationHistory } = useConversation()
  const {
    isResponding,
    apiError,
    apiConfigured,
    isMuted,
    contextStatus,
    generateResponse,
    clearApiError,
    clearOpenAIConversation,
    toggleMute,
    setResumeContent,
    setJobDescription,
    generateInitialQuestion
  } = useOpenAI()

  const handleFinalTranscript = (transcript: string) => {
    addToConversation('question', transcript)
    generateResponse(transcript, (response) => {
      addToConversation('response', response)
    })
  }

  const { isListening, currentTranscript, isSupported, startListening, stopListening } = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript,
    pauseListening: isResponding && !isMuted
  })

  const handleClearConversation = () => {
    clearConversationHistory()
    clearApiError()
    clearOpenAIConversation()
  }

  const handleResumeUpload = (content: string, fileName: string) => {
    setResumeContent(content)
    setResumeFileName(fileName)
  }

  const handleJobDescriptionUpload = (content: string, fileName: string) => {
    setJobDescription(content)
    setJobDescriptionFileName(fileName)
  }

  const handleStartInterview = () => {
    setIsInterviewStarted(true)
    generateInitialQuestion((response) => {
      addToConversation('response', response)
    })
  }

  if (!isSupported) {
    return (
      <ErrorMessage
        title="⚠️ Speech Recognition Not Supported"
        message="Your browser doesn't support speech recognition. Please try using Chrome or Edge."
      />
    )
  }

  if (!apiConfigured) {
    return (
      <ErrorMessage
        title="🔑 OpenAI API Key Required"
        message="Please set your OpenAI API key in the environment variables."
      >
        <SetupInstructions />
      </ErrorMessage>
    )
  }

  // Show interview setup if files aren't uploaded yet
  if (!contextStatus.isComplete) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-gray-50">
        <InterviewSetup
          onResumeUpload={handleResumeUpload}
          onJobDescriptionUpload={handleJobDescriptionUpload}
          resumeFileName={resumeFileName}
          jobDescriptionFileName={jobDescriptionFileName}
          isSetupComplete={contextStatus.isComplete}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-row p-4 font-sans bg-gray-50">
      <div className="w-full max-w-6xl space-y-6">
        <Header
          title="🎤 AI Interview Session ✨"
          subtitle={`Personalized interview • ${resumeFileName} • ${jobDescriptionFileName}`}
        />

        <Controls
          isListening={isListening}
          isResponding={isResponding}
          isMuted={isMuted}
          onStartListening={startListening}
          onStopListening={stopListening}
          onClearConversation={handleClearConversation}
          onToggleMute={toggleMute}
        />

        <StatusIndicators
          isListening={isListening}
          isResponding={isResponding}
          apiError={apiError}
        />

        {!isInterviewStarted ? (
          <InterviewControls
            onStartInterview={handleStartInterview}
            isInterviewStarted={isInterviewStarted}
            isResponding={isResponding}
          />
        ) : (
          <>
            <CurrentTranscript transcript={currentTranscript} />
            <Conversation conversation={conversation} />
          </>
        )}
      </div>
    </div>
  )
}

export default App