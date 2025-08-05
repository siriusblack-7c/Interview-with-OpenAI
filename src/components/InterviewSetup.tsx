import { FileUploader } from './FileUploader'

interface InterviewSetupProps {
    onResumeUpload: (content: string, fileName: string) => void
    onJobDescriptionUpload: (content: string, fileName: string) => void
    resumeFileName?: string
    jobDescriptionFileName?: string
    isSetupComplete: boolean
}

export const InterviewSetup = ({
    onResumeUpload,
    onJobDescriptionUpload,
    resumeFileName,
    jobDescriptionFileName,
    isSetupComplete
}: InterviewSetupProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        🎯 Interview Setup
                    </h2>
                    <p className="text-gray-600">
                        Upload your resume and the job description to personalize your interview experience
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <FileUploader
                        title="Resume"
                        acceptedTypes=".txt,.pdf,.doc,.docx"
                        onFileUpload={onResumeUpload}
                        currentFile={resumeFileName}
                        placeholder="Upload your resume"
                        icon="📄"
                    />

                    <FileUploader
                        title="Job Description"
                        acceptedTypes=".txt,.pdf,.doc,.docx"
                        onFileUpload={onJobDescriptionUpload}
                        currentFile={jobDescriptionFileName}
                        placeholder="Upload the job posting"
                        icon="💼"
                    />
                </div>

                {isSetupComplete && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <div className="text-green-600 text-xl mb-2">✅</div>
                        <p className="text-green-700 font-medium">
                            Setup complete! The AI interviewer will now ask questions tailored to your background and the role.
                        </p>
                    </div>
                )}

                {!isSetupComplete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                        <div className="text-amber-600 text-xl mb-2">⚠️</div>
                        <p className="text-amber-700">
                            Please upload both files to begin your personalized interview session.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}