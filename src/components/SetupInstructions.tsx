export const SetupInstructions = () => {
    return (
        <div className="mt-8 text-left bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="mb-4 text-gray-700 text-xl font-semibold">Setup Instructions:</h3>
            <ol className="space-y-3 pl-6 list-decimal">
                <li className="leading-relaxed">
                    Create a{' '}
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-700">
                        .env.local
                    </code>{' '}
                    file in the project root
                </li>
                <li className="leading-relaxed">
                    Add:{' '}
                    <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-700">
                        VITE_OPENAI_API_KEY=your_api_key_here
                    </code>
                </li>
                <li className="leading-relaxed">
                    Get your API key from{' '}
                    <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        OpenAI Platform
                    </a>
                </li>
                <li className="leading-relaxed">Restart the development server</li>
            </ol>
        </div>
    )
}