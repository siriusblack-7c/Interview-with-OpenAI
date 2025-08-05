// Browser compatibility checker for speech recognition
export const checkBrowserCompatibility = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isChrome = userAgent.includes('chrome') && !userAgent.includes('edg')
    const isEdge = userAgent.includes('edg')
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome')
    const isFirefox = userAgent.includes('firefox')
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

    const hasWebSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    const hasMediaDevices = !!navigator.mediaDevices

    return {
        browser: {
            isChrome,
            isEdge,
            isSafari,
            isFirefox,
            isMobile
        },
        support: {
            speechRecognition: hasWebSpeech,
            mediaDevices: hasMediaDevices,
            isHTTPS: window.location.protocol === 'https:',
            recommended: isChrome || isEdge
        },
        compatibility: {
            level: hasWebSpeech && hasMediaDevices && (isChrome || isEdge) ? 'full' :
                hasWebSpeech && hasMediaDevices ? 'partial' : 'none',
            issues: [
                !hasWebSpeech && 'Speech Recognition not supported',
                !hasMediaDevices && 'MediaDevices not available',
                isSafari && 'Safari has limited speech recognition support',
                isFirefox && 'Firefox speech recognition may be experimental',
                isMobile && 'Mobile browsers may have restrictions',
                window.location.protocol !== 'https:' && 'HTTPS required for production'
            ].filter(Boolean)
        }
    }
}

export const logBrowserInfo = () => {
    const info = checkBrowserCompatibility()
    console.log('🌐 [Browser] Compatibility Check:', info)
    return info
}