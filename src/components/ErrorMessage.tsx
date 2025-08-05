interface ErrorMessageProps {
    title: string
    message: string
    children?: React.ReactNode
}

export const ErrorMessage = ({ title, message, children }: ErrorMessageProps) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 font-sans bg-gray-50">
            <div className="text-center p-12 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 max-w-2xl w-full">
                <h2 className="mb-4 text-red-800 text-2xl font-bold">{title}</h2>
                <p className="text-lg mb-0">{message}</p>
                {children}
            </div>
        </div>
    )
}