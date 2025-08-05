import { useState, useCallback, useRef } from 'react'

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
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleClick = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    return (
        <div className="w-full group">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            <div
                className={`
                    relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${isDragOver
                        ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg'
                        : currentFile
                            ? 'border-green-500 bg-green-50/50 hover:bg-green-50 hover:border-green-600'
                            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md'
                    }
                    ${isUploading ? 'pointer-events-none' : ''}
                    group-hover:scale-[1.01]
                `}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={handleClick}
            >
                {isUploading ? (
                    <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto">
                            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium">Uploading...</p>
                            <p className="text-sm text-gray-500 mt-1">Please wait</p>
                        </div>
                    </div>
                ) : currentFile ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-green-700 font-semibold text-lg">{currentFile}</p>
                            <p className="text-sm text-gray-600 mt-2 bg-gray-100 rounded-lg px-3 py-1 inline-block">
                                Click to replace or drag new file
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100 transition-colors">
                            <span className="text-3xl text-gray-400 group-hover:text-blue-500 transition-colors">📄</span>
                        </div>
                        <div>
                            <p className="text-gray-700 font-medium text-lg">{placeholder}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Drag & drop or <span className="text-blue-600 font-medium">click to browse</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-1 inline-block">
                                Supports {acceptedTypes.toUpperCase()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}