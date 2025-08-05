import { useState, useRef } from 'react'
import { openAIService } from '../services/openai'

export const useOpenAI = () => {
    const [isResponding, setIsResponding] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiConfigured, setApiConfigured] = useState(() => openAIService.isConfigured())

    const synthRef = useRef<SpeechSynthesis | null>(null)

    // Initialize speech synthesis
    if (!synthRef.current) {
        synthRef.current = window.speechSynthesis
        console.log('🔊 [TTS] Speech synthesis available:', !!synthRef.current)
    }

    const generateResponse = async (question: string, onResponseGenerated: (response: string) => void) => {
        setIsResponding(true)
        setApiError(null)

        try {
            // Get response from OpenAI
            const response = await openAIService.generateResponse(question)

            onResponseGenerated(response)

            // Speak the response
            console.log('🔊 [TTS] Starting speech synthesis')
            if (synthRef.current) {
                const utterance = new SpeechSynthesisUtterance(response)
                utterance.rate = 0.9
                utterance.pitch = 1
                utterance.volume = 0.8

                utterance.onstart = () => {
                    console.log('🔊 [TTS] Speech started')
                }

                utterance.onend = () => {
                    console.log('🔊 [TTS] Speech ended')
                    setIsResponding(false)
                }

                utterance.onerror = (event: any) => {
                    console.error('❌ [TTS] Speech error:', event)
                    setIsResponding(false)
                }

                synthRef.current.speak(utterance)
            } else {
                console.log('❌ [TTS] Speech synthesis not available')
                setIsResponding(false)
            }
        } catch (error) {
            console.error('❌ [Response] Error generating response:', error)
            setApiError('Failed to generate response. Please try again.')
            setIsResponding(false)
        }
    }

    const clearApiError = () => {
        setApiError(null)
    }

    const clearOpenAIConversation = () => {
        openAIService.clearConversation()
    }

    return {
        isResponding,
        apiError,
        apiConfigured,
        generateResponse,
        clearApiError,
        clearOpenAIConversation
    }
}