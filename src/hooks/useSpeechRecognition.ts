import { useState, useEffect, useRef } from 'react'

interface UseSpeechRecognitionOptions {
    onFinalTranscript: (transcript: string) => void
}

declare global {
    interface Window {
        SpeechRecognition: any
        webkitSpeechRecognition: any
    }
}

export const useSpeechRecognition = ({ onFinalTranscript }: UseSpeechRecognitionOptions) => {
    const [isListening, setIsListening] = useState(false)
    const [currentTranscript, setCurrentTranscript] = useState('')
    const [isSupported, setIsSupported] = useState(false)

    const recognitionRef = useRef<any | null>(null)
    const silenceTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        console.log('🎤 Speech recognition supported:', !!SpeechRecognition)

        if (SpeechRecognition) {
            setIsSupported(true)
            recognitionRef.current = new SpeechRecognition()

            const recognition = recognitionRef.current
            recognition.continuous = false // Simple: one-time recognition
            recognition.interimResults = true
            recognition.lang = 'en-US'

            recognition.onstart = () => {
                console.log('🎙️ Started listening')
                setIsListening(true)
            }

            recognition.onresult = (event: any) => {
                let transcript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    transcript += result[0].transcript

                    if (result.isFinal) {
                        console.log('✅ Final transcript:', transcript.trim())
                        onFinalTranscript(transcript.trim())
                        setCurrentTranscript('')

                        // Start 5-second silence timer after final result
                        if (silenceTimeoutRef.current) {
                            clearTimeout(silenceTimeoutRef.current)
                        }
                        silenceTimeoutRef.current = setTimeout(() => {
                            console.log('⏰ 5 seconds of silence - stopping')
                            if (recognitionRef.current) {
                                recognitionRef.current.stop()
                            }
                        }, 5000)
                    } else {
                        // Show interim results
                        setCurrentTranscript(transcript)
                    }
                }
            }

            recognition.onerror = (event: any) => {
                console.error('❌ Speech recognition error:', event.error)
                setIsListening(false)
            }

            recognition.onend = () => {
                console.log('🛑 Recognition ended')
                setIsListening(false)
                setCurrentTranscript('')
                if (silenceTimeoutRef.current) {
                    clearTimeout(silenceTimeoutRef.current)
                    silenceTimeoutRef.current = null
                }
            }
        } else {
            console.log('❌ Speech recognition not supported')
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current)
            }
        }
    }, [onFinalTranscript])

    const startListening = () => {
        console.log('🎤 Starting to listen...')
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start()
            } catch (error) {
                console.error('❌ Error starting recognition:', error)
                setIsListening(false)
            }
        }
    }

    const stopListening = () => {
        console.log('🛑 Stopping listening...')
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current)
            silenceTimeoutRef.current = null
        }
    }

    return {
        isListening,
        currentTranscript,
        isSupported,
        startListening,
        stopListening
    }
}