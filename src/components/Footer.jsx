import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            PromptVerse
                        </span>
                        <p className="mt-4 text-gray-500 text-sm max-w-xs">
                            The ultimate marketplace for high-quality AI prompts. Empowering creators and developers with the best AI tools.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Platform</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/all-prompts" className="text-base text-gray-500 hover:text-gray-900">All Prompts</Link></li>
                            <li><Link href="/all-prompts" className="text-base text-gray-500 hover:text-gray-900">Trending</Link></li>
                            <li><Link href="/#top-creators" className="text-base text-gray-500 hover:text-gray-900">Top Creators</Link></li>
                            <li><Link href="/pricing" className="text-base text-gray-500 hover:text-gray-900">Pricing</Link></li>
                            <li><Link href="/demo-users" className="text-base text-gray-500 hover:text-gray-900">Demo Users</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-4">
                            <li><Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
                        <div className="mt-4 flex items-center gap-4 text-gray-500">
                            <Link href="#" aria-label="LinkedIn" className="hover:text-gray-900 transition-colors">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </Link>
                            <Link href="#" aria-label="Instagram" className="hover:text-gray-900 transition-colors">
                                <i className="fa-brands fa-instagram"></i>
                            </Link>
                            <Link href="#" aria-label="Facebook" className="hover:text-gray-900 transition-colors">
                                <i className="fa-brands fa-facebook"></i>
                            </Link>
                            <Link href="#" aria-label="X" className="hover:text-gray-900 transition-colors">
                                <i className="fa-brands fa-x-twitter"></i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-base text-gray-400">&copy; 2024 PromptHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
