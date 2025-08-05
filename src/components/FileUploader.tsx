import { useState, useCallback } from 'react'

interface FileUploaderProps {
    title: string
    acceptedTypes: string
    onFileUpload: (content: string, fileName: string) => void
    currentFile?: string
    placeholder: string
    icon: string
}

export const FileUploader = ({
    title,
    acceptedTypes,
    onFileUpload,
    currentFile,
    placeholder,
    icon
}: FileUploaderProps) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const readFile = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                resolve(content)
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsText(file)
        })
    }, [])

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const file = files[0]
        setIsUploading(true)

        try {
            const content = await readFile(file)
            onFileUpload(content, file.name)
            console.log(`📄 [Upload] ${title} uploaded:`, file.name)
        } catch (error) {
            console.error(`❌ [Upload] Error reading ${title}:`, error)
        } finally {
            setIsUploading(false)
        }
    }, [readFile, onFileUpload, title])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFileUpload(e.dataTransfer.files)
    }, [handleFileUpload])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files)
    }, [handleFileUpload])

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">{icon} {title}</h3>

            <div
                className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
          ${isDragOver
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                    }
          ${currentFile ? 'border-green-400 bg-green-50' : ''}
        `}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
            >
                <input
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-2">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">Uploading...</p>
                    </div>
                ) : currentFile ? (
                    <div className="space-y-2">
                        <div className="text-green-600 text-2xl">✅</div>
                        <p className="text-green-700 font-medium">{currentFile}</p>
                        <p className="text-sm text-gray-600">Click to replace or drag new file</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="text-gray-400 text-3xl">{icon}</div>
                        <p className="text-gray-600">{placeholder}</p>
                        <p className="text-sm text-gray-500">
                            Drag & drop or click to select • {acceptedTypes.toUpperCase()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}