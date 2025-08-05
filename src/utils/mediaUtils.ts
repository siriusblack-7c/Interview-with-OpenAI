// Utility functions for safe media API access

/**
 * Safely check if MediaDevices API is available
 */
export const isMediaDevicesSupported = (): boolean => {
    return !!(
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function'
    )
}

/**
 * Safely check if Permissions API is available
 */
export const isPermissionsAPISupported = (): boolean => {
    return 'permissions' in navigator &&
        typeof navigator.permissions?.query === 'function'
}

/**
 * Safely request microphone permission
 */
export const requestMicrophoneAccess = async (): Promise<MediaStream> => {
    if (!isMediaDevicesSupported()) {
        throw new Error('MediaDevices API not supported in this browser')
    }

    try {
        const stream = await navigator.mediaDevices!.getUserMedia({ audio: true })
        console.log('✅ [Media] Microphone access granted')
        return stream
    } catch (error: any) {
        console.error('❌ [Media] Microphone access denied:', error)
        throw new Error(`Microphone access failed: ${error.message}`)
    }
}

/**
 * Clean up media stream
 */
export const stopMediaStream = (stream: MediaStream): void => {
    stream.getTracks().forEach(track => {
        track.stop()
        console.log('🛑 [Media] Media track stopped:', track.kind)
    })
}

/**
 * Check microphone permission status
 */
export const checkMicrophonePermission = async (): Promise<PermissionState> => {
    if (!isPermissionsAPISupported()) {
        throw new Error('Permissions API not supported')
    }

    try {
        const permission = await navigator.permissions!.query({ name: 'microphone' })
        return permission.state
    } catch (error) {
        console.warn('⚠️ [Permissions] Could not check permission status:', error)
        throw error
    }
}