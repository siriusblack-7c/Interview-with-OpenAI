interface HeaderProps {
    title: string
    subtitle: string
}

export const Header = ({ title, subtitle }: HeaderProps) => {
    return (
        <header className="text-center py-8 px-6 bg-white rounded-xl border border-gray-200 shadow-lg w-full">
            <h1 className="mb-3 text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        </header>
    )
}