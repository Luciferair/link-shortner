import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 text-gray-200">
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 max-w-md w-full text-center">
                <h1 className="text-6xl md:text-7xl font-bold text-red-500 mb-4">404</h1>
                <div className="w-16 h-16 mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-xl mb-6 text-gray-300">Oops! The URL you're looking for doesn't exist or has expired.</p>
                <Link 
                    to="/" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Go Home
                </Link>
                <p className="mt-8 text-gray-500 text-sm">
                    URL Shortener Service - Links expire after 48 hours
                </p>
            </div>
        </div>
    )
}

export default NotFound
