interface CurrentTranscriptProps {
    transcript: string
}

export const CurrentTranscript = ({ transcript }: CurrentTranscriptProps) => {
    if (!transcript) return null

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Live Transcript</p>
                        <p className="text-gray-800 leading-relaxed text-lg font-medium">
                            "{transcript}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}