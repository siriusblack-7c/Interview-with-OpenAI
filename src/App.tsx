import './App.css'
import {
  Header,
  Controls,
  StatusIndicators,
  CurrentTranscript,
  Conversation,
  ErrorMessage,
  SetupInstructions
} from './components'
import { useSpeechRecognition, useConversation, useOpenAI } from './hooks'

function App() {
  // Custom hooks for business logic
  const { conversation, addToConversation, clearConversation: clearConversationHistory } = useConversation()
  const { isResponding, apiError, apiConfigured, generateResponse, clearApiError, clearOpenAIConversation } = useOpenAI()

  const handleFinalTranscript = (transcript: string) => {
    addToConversation('question', transcript)
    generateResponse(transcript, (response) => {
      addToConversation('response', response)
    })
  }

  const { isListening, currentTranscript, isSupported, startListening, stopListening } = useSpeechRecognition({
    onFinalTranscript: handleFinalTranscript
  })

  const handleClearConversation = () => {
    clearConversationHistory()
    clearApiError()
    clearOpenAIConversation()
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

  return (
    <div className="min-h-screen w-full flex flex-row p-4 font-sans bg-gray-50">
      <div className="w-full max-w-6xl space-y-6">
        <Header
          title="🎤 AI Interview POC Demo ✨"
          subtitle="Real-time speech recognition and AI response simulation"
        />

        <Controls
          isListening={isListening}
          isResponding={isResponding}
          onStartListening={startListening}
          onStopListening={stopListening}
          onClearConversation={handleClearConversation}
        />

        <StatusIndicators
          isListening={isListening}
          isResponding={isResponding}
          apiError={apiError}
        />

        <CurrentTranscript transcript={currentTranscript} />

        <Conversation conversation={conversation} />
      </div>
    </div>
  )
}

export default App