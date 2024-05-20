

export default function Navbar({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return <nav className="fixed top-0 z-50 w-full bg-card border-b">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start rtl:justify-end">
                    <button onClick={() => setIsOpen(!isOpen)} aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg hover:bg-accent">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <div className="flex ms-2 md:me-24">
                        <img src="/static/img/logo.svg" className="h-8 me-3" alt="BeatBliss Logo" />
                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">BeatBliss</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>
}
