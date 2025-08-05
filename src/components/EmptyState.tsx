export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to start your interview?</h3>
            <p className="text-gray-600 text-sm max-w-sm">Click "Start Listening" to begin your AI-powered interview session</p>
        </div>
    )
}