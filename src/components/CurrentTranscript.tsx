interface CurrentTranscriptProps {
    transcript: string
}

export const CurrentTranscript = ({ transcript }: CurrentTranscriptProps) => {
    if (!transcript) return null

    return (
        <div className="text-center w-full">
            <div className="bg-white p-4 rounded-xl border-l-4 border-indigo-500 max-w-2xl mx-auto italic shadow-sm">
                <strong>You're saying:</strong> {transcript}
            </div>
        </div>
    )
}