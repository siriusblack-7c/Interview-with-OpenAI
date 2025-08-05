interface HeaderProps {
    title: string
    subtitle: string
}

export const Header = ({ title, subtitle }: HeaderProps) => {
    return (
        <header className="text-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-glow-blue w-full">
            <h1 className="mb-2 text-4xl md:text-5xl font-bold text-center">{title}</h1>
            <p className="text-lg opacity-90">{subtitle}</p>
        </header>
    )
}