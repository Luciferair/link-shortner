import { useState } from 'react'

function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleShorten = async () => {
    if (!url) {
      setError('Please enter a URL')
      return
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:8080/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ URL: url }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL')
      }
      
      setShortUrl(data.ShortURL)
    } catch (err:any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        alert('URL copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy')
      })
  }
  
  const handleOpen = () => {
    window.open(shortUrl, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto pt-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">URL Shortener</h1>
          <p className="text-gray-600">Transform your long URLs into short, manageable links</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-700 mb-2">Enter your long URL</label>
            <input
              type="text"
              id="url"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-blue-300"
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Shorten URL'}
          </button>
          
          {shortUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">Your shortened URL:</p>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={shortUrl} 
                  readOnly 
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none bg-white"
                />
                <button 
                  onClick={handleCopy}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 border-t border-r border-b rounded-r-lg transition-colors"
                >
                  Copy
                </button>
              </div>
              <div className="mt-2 text-right">
                <button 
                  onClick={handleOpen} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Open Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home