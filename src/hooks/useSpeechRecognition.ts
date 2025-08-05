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

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        console.log('🎤 [Mic] Speech recognition supported:', !!SpeechRecognition)

        if (SpeechRecognition) {
            setIsSupported(true)
            recognitionRef.current = new SpeechRecognition()

            const recognition = recognitionRef.current
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-US'

            console.log('🎤 [Mic] Speech recognition configured')

            recognition.onstart = () => {
                console.log('🎙️ [Mic] Recognition started')
            }

            recognition.onresult = (event: any) => {
                let transcript = ''
                let interimTranscript = ''
                let finalTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    const text = result[0].transcript

                    if (result.isFinal) {
                        finalTranscript += text
                        console.log('📝 [Recording] Final text:', text, '(confidence:', result[0].confidence.toFixed(2), ')')
                    } else {
                        interimTranscript += text
                        console.log('🎙️ [Recording] Interim text:', text)
                    }

                    transcript += text
                }

                // Show full current transcript
                console.log('📋 [Recording] Full transcript so far:', transcript)
                setCurrentTranscript(transcript)

                // If the result is final, add it as a question
                const isFinal = event.results[event.results.length - 1].isFinal
                if (isFinal) {
                    console.log('✅ [Recording] FINAL COMPLETE:', transcript.trim())
                    onFinalTranscript(transcript.trim())
                    setCurrentTranscript('')
                }
            }

            recognition.onerror = (event: any) => {
                console.error('❌ [Mic] Recognition error:', event.error)
                setIsListening(false)
            }

            recognition.onend = () => {
                console.log('🛑 [Mic] Recognition ended')
                setIsListening(false)
            }

            recognition.onspeechstart = () => {
                console.log('🗣️ [Recording] Speech detected - starting to record!')
            }

            recognition.onspeechend = () => {
                console.log('🤐 [Recording] Speech stopped - processing...')
            }

            recognition.onsoundstart = () => {
                console.log('🔊 [Recording] Sound detected')
            }

            recognition.onsoundend = () => {
                console.log('🔇 [Recording] Sound ended')
            }

            recognition.onnomatch = () => {
                console.log('❓ [Recording] No speech match found')
            }
        } else {
            console.log('❌ [Mic] Speech recognition NOT supported')
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [onFinalTranscript])

    const startListening = () => {
        console.log('🎤 [Controls] Starting microphone...')
        if (recognitionRef.current && !isListening) {
            setIsListening(true)
            try {
                recognitionRef.current.start()
            } catch (error) {
                console.error('❌ [Controls] Error starting microphone:', error)
                setIsListening(false)
            }
        }
    }

    const stopListening = () => {
        console.log('🛑 [Controls] Stopping microphone...')
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
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