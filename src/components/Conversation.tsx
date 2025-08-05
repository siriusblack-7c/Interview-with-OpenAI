import { Message } from './Message'
import type { ConversationEntry } from './Message'
import { EmptyState } from './EmptyState'

interface ConversationProps {
    conversation: ConversationEntry[]
}

export const Conversation = ({ conversation }: ConversationProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white min-h-[400px]">
            {conversation.length === 0 ? (
                <EmptyState />
            ) : (
                conversation.map((entry) => (
                    <Message key={entry.id} entry={entry} />
                ))
            )}
        </div>
    )
}