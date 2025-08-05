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

// System prompt for the AI to act as an professional interviewer
const SYSTEM_PROMPT = `You are a professional technical interviewer conducting a job interview. You should:

- Ask thoughtful, relevant interview questions
- Focus on technical skills, experience, and problem-solving abilities
- Ask follow-up questions based on candidate responses
- Keep questions concise and clear (1-2 sentences typically)
- Be professional but friendly
- Ask about specific technologies, projects, and scenarios
- Gradually increase complexity based on candidate's responses
- Ask both technical and behavioral questions

Remember: You're the interviewer asking questions, not answering them. Guide the conversation and evaluate the candidate's responses.`

export class OpenAIService {
    private conversationHistory: ConversationMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT }
    ]
    private resumeContent: string = ''
    private jobDescriptionContent: string = ''

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

    // Set resume content for personalized interviews
    setResumeContent(content: string): void {
        this.resumeContent = content
        this.updateSystemPrompt()
        console.log('📄 [Context] Resume content updated')
    }

    // Set job description for targeted interviews
    setJobDescription(content: string): void {
        this.jobDescriptionContent = content
        this.updateSystemPrompt()
        console.log('💼 [Context] Job description updated')
    }

    // Update system prompt with context
    private updateSystemPrompt(): void {
        let contextualPrompt = SYSTEM_PROMPT

        if (this.resumeContent || this.jobDescriptionContent) {
            contextualPrompt += `\n\nCONTEXT FOR THIS INTERVIEW:`

            if (this.jobDescriptionContent) {
                contextualPrompt += `\n\nJOB DESCRIPTION:\n${this.jobDescriptionContent}`
            }

            if (this.resumeContent) {
                contextualPrompt += `\n\nCANDIDATE'S RESUME:\n${this.resumeContent}`
            }

            contextualPrompt += `\n\nBased on this context, ask relevant questions that assess the candidate's fit for this specific role. Reference specific requirements from the job description and explore experiences mentioned in their resume.

IMPORTANT: Start each interview session with a brief welcome and your first question. Don't wait for the candidate to speak first.`
        }

        // Update the system message in conversation history
        this.conversationHistory[0] = { role: 'system', content: contextualPrompt }
        console.log('🎯 [Context] System prompt updated with personalized context')
    }

    // Reset conversation for a fresh start
    clearConversation(): void {
        this.conversationHistory = [
            { role: 'system', content: SYSTEM_PROMPT }
        ]
        this.updateSystemPrompt() // Maintain context after clearing
    }

    // Check if API key is configured
    isConfigured(): boolean {
        const configured = !!import.meta.env.VITE_OPENAI_API_KEY &&
            import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here'
        console.log('🔍 [OpenAI] API configured:', configured)
        return configured
    }

    // Check if interview context is complete
    isContextComplete(): boolean {
        return !!(this.resumeContent && this.jobDescriptionContent)
    }

    // Get current context status
    getContextStatus() {
        return {
            hasResume: !!this.resumeContent,
            hasJobDescription: !!this.jobDescriptionContent,
            isComplete: this.isContextComplete()
        }
    }

    // Generate initial interview question to start the session
    async generateInitialQuestion(): Promise<string> {
        console.log('🚀 [OpenAI] Generating initial interview question')

        try {
            const response = await this.generateResponse('Please start the interview with a brief welcome and your first question for me.')
            return response
        } catch (error) {
            console.error('❌ [OpenAI] Error generating initial question:', error)
            return "Hello! Welcome to your interview today. I'm excited to learn more about your background and experience. Could you please start by telling me a bit about yourself and what interests you about this role?"
        }
    }
}

export const openAIService = new OpenAIService()