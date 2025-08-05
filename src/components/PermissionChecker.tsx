import { useState, useEffect } from 'react'

interface PermissionStatus {
    microphone: 'granted' | 'denied' | 'prompt' | 'unknown'
    isChecking: boolean
    error?: string
}

export const PermissionChecker = ({
    onPermissionGranted,
    onPermissionDenied
}: {
    onPermissionGranted: () => void
    onPermissionDenied: (error: string) => void
}) => {
    const [status, setStatus] = useState<PermissionStatus>({
        microphone: 'unknown',
        isChecking: false
    })

    const checkPermissions = async () => {
        setStatus(prev => ({ ...prev, isChecking: true }))

        try {
            // Check if permissions API is available
            if ('permissions' in navigator) {
                const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
                setStatus(prev => ({
                    ...prev,
                    microphone: permission.state,
                    isChecking: false
                }))

                if (permission.state === 'granted') {
                    onPermissionGranted()
                } else if (permission.state === 'denied') {
                    onPermissionDenied('Microphone access denied. Please enable microphone permissions in your browser settings.')
                }
            } else {
                // Fallback: Try to access microphone directly
                console.log('🔍 [Permissions] Permissions API not available, trying direct access')
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                stream.getTracks().forEach(track => track.stop()) // Clean up

                setStatus(prev => ({
                    ...prev,
                    microphone: 'granted',
                    isChecking: false
                }))
                onPermissionGranted()
            }
        } catch (error: any) {
            console.error('❌ [Permissions] Error checking microphone:', error)
            setStatus(prev => ({
                ...prev,
                microphone: 'denied',
                isChecking: false,
                error: error.message
            }))
            onPermissionDenied(`Microphone access failed: ${error.message}`)
        }
    }

    useEffect(() => {
        checkPermissions()
    }, [])

    if (status.isChecking) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-blue-700">🔐 Checking microphone permissions...</p>
            </div>
        )
    }

    if (status.microphone === 'denied') {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-red-600 text-xl mb-2">🚫</div>
                <p className="text-red-700 font-medium mb-2">Microphone Access Denied</p>
                <p className="text-red-600 text-sm mb-3">
                    This app needs microphone access to work. Please:
                </p>
                <ol className="text-left text-sm text-red-600 list-decimal list-inside space-y-1 mb-3">
                    <li>Click the microphone icon in your browser's address bar</li>
                    <li>Select "Allow" for microphone access</li>
                    <li>Refresh the page</li>
                </ol>
                <button
                    onClick={checkPermissions}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                    🔄 Try Again
                </button>
            </div>
        )
    }

    if (status.microphone === 'prompt') {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <div className="text-amber-600 text-xl mb-2">⏳</div>
                <p className="text-amber-700 font-medium mb-2">Permission Required</p>
                <p className="text-amber-600 text-sm">
                    Please allow microphone access when prompted by your browser.
                </p>
            </div>
        )
    }

    return null // Permission granted, don't show anything
}