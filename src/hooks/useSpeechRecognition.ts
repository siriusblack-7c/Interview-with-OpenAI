import { useState, useEffect, useRef } from 'react'
import { logBrowserInfo } from '../utils/browserCheck'

interface UseSpeechRecognitionOptions {
    onFinalTranscript: (transcript: string) => void
    pauseListening?: boolean
    onError?: (error: string) => void
}

declare global {
    interface Window {
        SpeechRecognition: any
        webkitSpeechRecognition: any
    }
}

export const useSpeechRecognition = ({ onFinalTranscript, pauseListening = false, onError }: UseSpeechRecognitionOptions) => {
    const [isListening, setIsListening] = useState(false)
    const [currentTranscript, setCurrentTranscript] = useState('')
    const [isSupported, setIsSupported] = useState(false)
    const [wasPausedForSpeech, setWasPausedForSpeech] = useState(false)
    const [shouldKeepListening, setShouldKeepListening] = useState(false)

    const recognitionRef = useRef<any | null>(null)

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        console.log('🎤 [Mic] Speech recognition supported:', !!SpeechRecognition)

        // Detailed browser compatibility check
        const browserInfo = logBrowserInfo()

        if (browserInfo.compatibility.level === 'none') {
            console.error('❌ [Browser] Incompatible browser detected')
            console.error('🚨 [Browser] Issues:', browserInfo.compatibility.issues)
        } else if (browserInfo.compatibility.level === 'partial') {
            console.warn('⚠️ [Browser] Partial support detected')
            console.warn('🚨 [Browser] Potential issues:', browserInfo.compatibility.issues)
        }

        if (SpeechRecognition) {
            setIsSupported(true)
            recognitionRef.current = new SpeechRecognition()

            const recognition = recognitionRef.current
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-US'

            // Production-specific settings for Vercel
            recognition.maxAlternatives = 1
            recognition.serviceURI = undefined // Let browser choose

            // Additional timeout handling for production
            let silenceTimeout: number | null = null

            console.log('🎤 [Mic] Speech recognition configured')

            recognition.onstart = () => {
                console.log('🎙️ [Mic] Recognition started successfully')
                console.log('📊 [Mic] Recognition state - continuous:', recognition.continuous, 'interim:', recognition.interimResults)

                // Clear any existing silence timeout
                if (silenceTimeout) {
                    clearTimeout(silenceTimeout)
                    silenceTimeout = null
                }

                // Set a longer timeout for production environments
                silenceTimeout = setTimeout(() => {
                    if (shouldKeepListening && !wasPausedForSpeech) {
                        console.log('⏰ [Mic] Silence timeout - restarting recognition')
                        try {
                            recognition.stop()
                        } catch (e) {
                            console.warn('⚠️ [Mic] Error stopping for timeout restart:', e)
                        }
                    }
                }, 30000) // 30 second timeout for production
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
                console.error('📋 [Mic] Error details:', {
                    error: event.error,
                    message: event.message,
                    timeStamp: event.timeStamp,
                    type: event.type
                })
                setIsListening(false)

                // Auto-restart on certain errors if we should keep listening
                if (shouldKeepListening && !wasPausedForSpeech) {
                    const errorType = event.error
                    if (errorType === 'no-speech' || errorType === 'audio-capture' || errorType === 'network') {
                        console.log('🔄 [Mic] Auto-restarting after recoverable error...')
                        setTimeout(() => {
                            try {
                                if (recognitionRef.current && shouldKeepListening) {
                                    recognitionRef.current.start()
                                    setIsListening(true)
                                }
                            } catch (error) {
                                console.error('❌ [Mic] Error auto-restarting after error:', error)
                            }
                        }, 1000) // Longer delay for error recovery
                    } else {
                        // For non-recoverable errors, stop trying
                        console.error('❌ [Mic] Non-recoverable error, stopping auto-restart')
                        setShouldKeepListening(false)
                    }
                }
            }

            recognition.onend = () => {
                console.log('🛑 [Mic] Recognition ended')
                setIsListening(false)

                // Clear silence timeout
                if (silenceTimeout) {
                    clearTimeout(silenceTimeout)
                    silenceTimeout = null
                }

                // Auto-restart if we should keep listening and we're not paused for speech
                if (shouldKeepListening && !wasPausedForSpeech) {
                    console.log('🔄 [Mic] Auto-restarting recognition...')
                    // Longer delay for production environments
                    const restartDelay = window.location.hostname.includes('.vercel.app') ? 500 : 100
                    setTimeout(() => {
                        try {
                            if (recognitionRef.current && shouldKeepListening && isSupported) {
                                console.log('🚀 [Mic] Attempting restart...')
                                recognitionRef.current.start()
                                setIsListening(true)
                            }
                        } catch (error) {
                            console.error('❌ [Mic] Error auto-restarting:', error)
                            // If restart fails, wait longer and try again
                            setTimeout(() => {
                                if (shouldKeepListening) {
                                    console.log('🔄 [Mic] Retry restart after error...')
                                    try {
                                        recognitionRef.current?.start()
                                        setIsListening(true)
                                    } catch (retryError) {
                                        console.error('❌ [Mic] Retry failed:', retryError)
                                        setShouldKeepListening(false)
                                        onError?.('Speech recognition failed to restart. Please try again.')
                                    }
                                }
                            }, 2000)
                        }
                    }, restartDelay)
                }
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
            setShouldKeepListening(false)
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [onFinalTranscript, shouldKeepListening, wasPausedForSpeech])

    // Effect to handle pausing/resuming recognition during AI speech
    useEffect(() => {
        if (pauseListening && isListening) {
            console.log('⏸️ [Mic] Pausing recognition during AI speech')
            setWasPausedForSpeech(true)
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        } else if (!pauseListening && wasPausedForSpeech && shouldKeepListening) {
            console.log('▶️ [Mic] Resuming recognition after AI speech')
            setWasPausedForSpeech(false)
            if (recognitionRef.current && isSupported) {
                setTimeout(() => {
                    try {
                        recognitionRef.current.start()
                        setIsListening(true)
                    } catch (error) {
                        console.error('❌ [Mic] Error resuming recognition:', error)
                        setIsListening(false)
                    }
                }, 500) // Small delay to ensure TTS has fully stopped
            }
        }
    }, [pauseListening, wasPausedForSpeech, isListening, isSupported, shouldKeepListening])

    const startListening = async () => {
        console.log('🎤 [Controls] Starting microphone...')

        // Check microphone permissions first
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                console.log('🔐 [Permissions] Checking microphone access...')
                await navigator.mediaDevices.getUserMedia({ audio: true })
                console.log('✅ [Permissions] Microphone access granted')
            }
        } catch (permError) {
            console.error('❌ [Permissions] Microphone permission error:', permError)
            onError?.('Microphone permission denied. Please allow microphone access and try again.')
            return
        }

        if (recognitionRef.current && !isListening) {
            setShouldKeepListening(true)
            setIsListening(true)
            try {
                recognitionRef.current.start()
                console.log('🚀 [Controls] Recognition start command sent')
            } catch (error: any) {
                console.error('❌ [Controls] Error starting microphone:', error)
                console.error('📋 [Controls] Error details:', {
                    name: error?.name,
                    message: error?.message,
                    stack: error?.stack
                })
                setIsListening(false)
                setShouldKeepListening(false)
            }
        } else {
            console.warn('⚠️ [Controls] Cannot start - recognition not available or already listening')
        }
    }

    const stopListening = () => {
        console.log('🛑 [Controls] Stopping microphone...')
        setShouldKeepListening(false) // Prevent auto-restart
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