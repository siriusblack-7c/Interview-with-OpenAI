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
        <div className="flex flex-wrap gap-4 justify-center w-full">
            <button
                className={`
          px-8 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[180px]
          ${isListening
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-glow-green animate-pulse-soft'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-glow-red hover:-translate-y-0.5 hover:shadow-glow-red-hover'
                    }
          ${isResponding ? 'opacity-60 cursor-not-allowed' : ''}
        `}
                onClick={isListening ? onStopListening : onStartListening}
                disabled={isResponding}
            >
                {isListening ? '🔴 Stop Listening' : '🎤 Start Listening'}
            </button>

            <button
                className={`
          px-8 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[150px]
          ${isMuted
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-glow-gray'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow-green'
                    }
          ${(isListening || isResponding)
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:-translate-y-0.5'
                    }
        `}
                onClick={onToggleMute}
                disabled={isListening || isResponding}
            >
                {isMuted ? '🔇 Audio Off' : '🔊 Audio On'}
            </button>

            <button
                className={`
          px-8 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 min-w-[150px]
          bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow-blue
          ${(isListening || isResponding)
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:-translate-y-0.5 hover:shadow-glow-blue-hover'
                    }
        `}
                onClick={onClearConversation}
                disabled={isListening || isResponding}
            >
                🗑️ Clear Chat
            </button>
        </div>
    )
}