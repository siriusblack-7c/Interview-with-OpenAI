interface StatusIndicatorsProps {
    isListening: boolean
    isResponding: boolean
    apiError: string | null
}

export const StatusIndicators = ({ isListening, isResponding, apiError }: StatusIndicatorsProps) => {
    return (
        <div className="text-center min-h-[60px] flex flex-col items-center gap-2 w-full">
            {isListening && (
                <div className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-glow-green animate-fade-in">
                    🎙️ Listening...
                </div>
            )}
            {isResponding && (
                <div className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-yellow-500 shadow-glow-orange animate-pulse-soft">
                    🤖 AI is thinking and responding...
                </div>
            )}
            {apiError && (
                <div className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 shadow-lg">
                    ⚠️ {apiError}
                </div>
            )}
        </div>
    )
}