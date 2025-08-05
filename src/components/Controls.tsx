interface ControlsProps {
    isListening: boolean
    isResponding: boolean
    isMuted: boolean
    onStartListening: () => void
    onStopListening: () => void
    onClearConversation: () => void
    onToggleMute: () => void
}

export const Controls = ({
    isListening,
    isResponding,
    isMuted,
    onStartListening,
    onStopListening,
    onClearConversation,
    onToggleMute
}: ControlsProps) => {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {/* Main Listening Button */}
                    <button
                        className={`
                            relative px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 min-w-[180px]
                            ${isListening
                                ? 'bg-green-500 text-white shadow-2xl scale-105 ring-4 ring-green-200 animate-pulse'
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:scale-105 shadow-lg'
                            }
                            ${isResponding ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                            flex items-center justify-center gap-3 group
                        `}
                        onClick={isListening ? onStopListening : onStartListening}
                        disabled={isResponding}
                    >
                        <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${isListening ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}
                            transition-all duration-200
                        `}>
                            <span className="text-sm">
                                {isListening ? '🔴' : '🎤'}
                            </span>
                        </div>
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                        {/* Audio Toggle */}
                        <button
                            className={`
                                px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 min-w-[100px]
                                ${isMuted
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300'
                                }
                                ${(isListening || isResponding)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-md hover:scale-105 active:scale-95'
                                }
                                flex items-center justify-center gap-2
                            `}
                            onClick={onToggleMute}
                            disabled={isListening || isResponding}
                        >
                            <span className="text-base">{isMuted ? '🔇' : '🔊'}</span>
                            <span className="hidden sm:inline text-xs">
                                {isMuted ? 'Off' : 'On'}
                            </span>
                        </button>

                        {/* Clear Button */}
                        <button
                            className={`
                                px-4 py-4 rounded-xl text-sm font-medium transition-all duration-200 min-w-[100px]
                                bg-red-100 text-red-700 hover:bg-red-200 border border-red-300
                                ${(isListening || isResponding)
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:shadow-md hover:scale-105 active:scale-95'
                                }
                                flex items-center justify-center gap-2
                            `}
                            onClick={onClearConversation}
                            disabled={isListening || isResponding}
                        >
                            <span className="text-base">🗑️</span>
                            <span className="hidden sm:inline text-xs">Clear</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}