import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
})

export interface ConversationMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

// System prompt for the AI to act as an interview candidate
const SYSTEM_PROMPT = `You are an experienced software developer participating in a job interview. You should:

- Answer questions professionally and conversationally
- Draw from realistic experience with modern web technologies (React, JavaScript, TypeScript, Node.js, databases, etc.)
- Be confident but humble
- Give specific examples when appropriate
- Keep responses concise (1-3 sentences typically)
- Show enthusiasm for learning and problem-solving
- Be natural and personable

Remember: You're the candidate being interviewed, not the interviewer. Answer questions as if you're showcasing your skills and experience.`

export class OpenAIService {
    private conversationHistory: ConversationMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT }
    ]

    async generateResponse(question: string): Promise<string> {
        console.log('🤖 [OpenAI] Generating response for:', question)

        try {
            // Add the user's question to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: question
            })

            console.log('🌐 [OpenAI] Calling API with', this.conversationHistory.length, 'messages')

            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: this.conversationHistory,
                max_tokens: 150,
                temperature: 0.7,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            })

            const response = completion.choices[0]?.message?.content || 'I need a moment to think about that.'
            console.log('✅ [OpenAI] Response received:', response.substring(0, 100) + '...')

            // Add the AI's response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            })

            // Keep conversation history manageable (last 10 exchanges)
            if (this.conversationHistory.length > 21) { // 1 system + 20 messages
                console.log('🧹 [OpenAI] Trimming conversation history')
                this.conversationHistory = [
                    this.conversationHistory[0], // Keep system prompt
                    ...this.conversationHistory.slice(-20) // Keep last 20 messages
                ]
            }

            return response
        } catch (error) {
            console.error('❌ [OpenAI] API Error:', error)

            // Fallback responses for different error types
            if (error instanceof Error) {
                if (error.message.includes('API key')) {
                    console.log('🔑 [OpenAI] API key error detected')
                    return "I'm having trouble connecting to my knowledge base. Please check the API key configuration."
                }
                if (error.message.includes('rate limit')) {
                    console.log('⏰ [OpenAI] Rate limit error detected')
                    return "I'm getting too many questions at once. Let me take a moment to process this."
                }
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    console.log('🌐 [OpenAI] Network error detected')
                    return "I'm having connectivity issues right now. Could you repeat that question?"
                }
            }

            return "I'm experiencing some technical difficulties. Could you rephrase your question?"
        }
    }

    // Reset conversation for a fresh start
    clearConversation(): void {
        this.conversationHistory = [
            { role: 'system', content: SYSTEM_PROMPT }
        ]
    }

    // Check if API key is configured
    isConfigured(): boolean {
        const configured = !!import.meta.env.VITE_OPENAI_API_KEY &&
            import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here'
        console.log('🔍 [OpenAI] API configured:', configured)
        return configured
    }
}

export const openAIService = new OpenAIService()