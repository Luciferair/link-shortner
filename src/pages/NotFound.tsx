import { Link } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 text-gray-200">
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 max-w-md w-full text-center">
                <h1 className="text-6xl md:text-7xl font-bold text-red-500 mb-4">404</h1>
                <div className="w-16 h-16 mx-auto mb-6">
                    <AlertCircle className="h-full w-full text-red-400" />
                </div>
                <p className="text-xl mb-6 text-gray-300">
                    Oops! The URL you're looking for doesn't exist or has expired.
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                    <Home className="h-5 w-5 mr-2" />
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
