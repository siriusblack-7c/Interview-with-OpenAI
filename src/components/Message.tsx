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
        p-6 border-b border-gray-100 last:border-b-0 animate-slide-in
        ${entry.type === 'question'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500'
                    : 'bg-gradient-to-r from-purple-50 to-pink-100 border-l-4 border-purple-500'
                }
      `}
        >
            <div className="flex justify-between items-center mb-3 text-sm">
                <span className="font-bold text-gray-700">
                    {entry.type === 'question' ? '🧑‍💼 Interviewer' : '🤖 AI Candidate'}
                </span>
                <span className="text-gray-500 text-xs">
                    {entry.timestamp.toLocaleTimeString()}
                </span>
            </div>
            <div className="text-gray-800 leading-relaxed">{entry.text}</div>
        </div>
    )
}