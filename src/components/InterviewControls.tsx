interface InterviewControlsProps {
    onStartInterview: () => void
    isInterviewStarted: boolean
    isResponding: boolean
}

export const InterviewControls = ({
    onStartInterview,
    isInterviewStarted,
    isResponding
}: InterviewControlsProps) => {
    if (isInterviewStarted) {
        return null // Hide the start button once interview has begun
    }

    return (
        <div className="w-full max-w-4xl mx-auto text-center py-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            🚀 Ready to Begin Your Interview?
                        </h2>
                        <p className="text-gray-600">
                            The AI interviewer will start with a welcome message and your first question.
                            Make sure your microphone is ready!
                        </p>
                    </div>

                    <button
                        className={`
              px-12 py-4 rounded-full text-xl font-semibold cursor-pointer transition-all duration-300
              ${isResponding
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:-translate-y-1 hover:shadow-xl'
                            }
            `}
                        onClick={onStartInterview}
                        disabled={isResponding}
                    >
                        {isResponding ? '🤖 AI is preparing...' : '🎙️ Start Interview'}
                    </button>

                    <div className="text-sm text-gray-500">
                        📝 Tip: Speak clearly and wait for the AI to finish speaking before responding
                    </div>
                </div>
            </div>
        </div>
    )
}