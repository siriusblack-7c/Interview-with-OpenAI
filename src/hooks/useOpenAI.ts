import { useState, useRef } from 'react'
import { openAIService } from '../services/openai'

export const useOpenAI = () => {
    const [isResponding, setIsResponding] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiConfigured, setApiConfigured] = useState(() => openAIService.isConfigured())
    const [isMuted, setIsMuted] = useState(false)
    const [contextStatus, setContextStatus] = useState(() => openAIService.getContextStatus())

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

            // Speak the response (only if not muted)
            console.log('🔊 [TTS] Starting speech synthesis')
            if (synthRef.current && !isMuted) {
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
            } else if (!synthRef.current) {
                console.log('❌ [TTS] Speech synthesis not available')
                setIsResponding(false)
            } else {
                console.log('🔇 [TTS] Audio muted - skipping speech synthesis')
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

    const toggleMute = () => {
        setIsMuted(prev => !prev)
        console.log('🔇 [TTS] Audio', isMuted ? 'unmuted' : 'muted')
    }

    const setResumeContent = (content: string) => {
        openAIService.setResumeContent(content)
        setContextStatus(openAIService.getContextStatus())
    }

    const setJobDescription = (content: string) => {
        openAIService.setJobDescription(content)
        setContextStatus(openAIService.getContextStatus())
    }

    const generateInitialQuestion = async (onResponseGenerated: (response: string) => void) => {
        setIsResponding(true)
        setApiError(null)

        try {
            const response = await openAIService.generateInitialQuestion()
            onResponseGenerated(response)

            // Speak the initial question
            if (synthRef.current && !isMuted) {
                const utterance = new SpeechSynthesisUtterance(response)
                utterance.rate = 0.9
                utterance.pitch = 1
                utterance.volume = 0.8

                utterance.onend = () => {
                    setIsResponding(false)
                }

                utterance.onerror = () => {
                    setIsResponding(false)
                }

                synthRef.current.speak(utterance)
            } else {
                setIsResponding(false)
            }
        } catch (error) {
            console.error('❌ [Initial Question] Error:', error)
            setIsResponding(false)
        }
    }

    return {
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
        generateInitialQuestion,
        setApiConfigured
    }
}