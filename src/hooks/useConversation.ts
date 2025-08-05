import { useState } from 'react'
import type { ConversationEntry } from '../components/Message'

export const useConversation = () => {
    const [conversation, setConversation] = useState<ConversationEntry[]>([])

    const addToConversation = (type: 'question' | 'response', text: string) => {
        const newEntry: ConversationEntry = {
            id: Date.now().toString(),
            type,
            text,
            timestamp: new Date()
        }
        setConversation(prev => [...prev, newEntry])
    }

    const clearConversation = () => {
        setConversation([])
    }

    return {
        conversation,
        addToConversation,
        clearConversation
    }
}