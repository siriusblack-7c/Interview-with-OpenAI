interface StatusIndicatorsProps {
    isListening: boolean
    isResponding: boolean
    apiError: string | null
}

export const StatusIndicators = ({ isListening, isResponding, apiError }: StatusIndicatorsProps) => {
    return (
        <div className="text-center min-h-[60px] flex flex-col items-center gap-3 w-full">
            {isListening && (
                <div className="bg-white border border-green-200 rounded-2xl px-8 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 w-4 h-4 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-green-700 font-semibold">🎙️ Listening...</span>
                    </div>
                </div>
            )}
            {isResponding && (
                <div className="bg-white border border-blue-200 rounded-2xl px-8 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse delay-0"></div>
                            <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                        </div>
                        <span className="text-blue-700 font-semibold">🤖 AI is responding...</span>
                    </div>
                </div>
            )}
            {apiError && (
                <div className="bg-white border border-red-200 rounded-2xl px-8 py-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-red-700 font-semibold">⚠️ {apiError}</span>
                    </div>
                </div>
            )}
        </div>
    )
}