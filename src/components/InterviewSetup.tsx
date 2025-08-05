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
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50/50 px-8 py-6 border-b border-gray-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Interview Setup
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Upload your resume and the job description to create a personalized interview experience
                        </p>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="p-8">
                    <div className="grid lg:grid-cols-2 gap-8">
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

                    {/* Status Messages */}
                    <div className="mt-8">
                        {isSetupComplete ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">✅</span>
                                </div>
                                <h3 className="text-green-800 font-semibold text-lg mb-2">Setup Complete!</h3>
                                <p className="text-green-700">
                                    The AI interviewer will now ask questions tailored to your background and the role.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-xl">⚠️</span>
                                </div>
                                <h3 className="text-amber-800 font-semibold text-lg mb-2">Upload Required</h3>
                                <p className="text-amber-700">
                                    Please upload both files to begin your personalized interview session.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}