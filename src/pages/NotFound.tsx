import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-xl mb-8">Oops! The URL you're looking for doesn't exist.</p>
            <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Go Home
            </Link>
        </div>
    )
}

export default NotFound
