export interface ConversationEntry {
    id: string
    type: 'question' | 'response'
    text: string
    timestamp: Date
}

interface MessageProps {
    entry: ConversationEntry
}

export const Message = ({ entry }: MessageProps) => {
    return (
        <div
            className={`
                p-6 transition-all duration-300 hover:shadow-sm
                ${entry.type === 'question'
                    ? 'bg-blue-50/30'
                    : 'bg-purple-50/30'
                }
                border-b border-gray-100 last:border-b-0
            `}
        >
            <div className="flex gap-4">
                {/* Avatar */}
                <div className={`
                    w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm
                    ${entry.type === 'question'
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }
                `}>
                    {entry.type === 'question' ? '👤' : '🤖'}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-800">
                            {entry.type === 'question' ? 'You (Candidate)' : 'AI Interviewer'}
                        </span>
                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded-lg">
                            {entry.timestamp.toLocaleTimeString()}
                        </span>
                    </div>
                    <div className="text-gray-800 leading-relaxed text-base">{entry.text}</div>
                </div>
            </div>
        </div>
    )
}