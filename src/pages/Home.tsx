import { useState, useEffect } from 'react'

function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [copied, setCopied] = useState(false)


  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

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
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true);
        setToast({ show: true, message: 'URL copied to clipboard!', type: 'success' });
      })
      .catch(() => {
        setToast({ show: true, message: 'Failed to copy', type: 'error' });
      })
  }

  const handleOpen = () => {
    window.open(shortUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-3 md:p-4 text-gray-200">

      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg transition-all duration-300 transform translate-x-0 z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-8 md:pt-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-300 mb-2 md:mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL Shortener
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">Transform your long, unwieldy URLs into concise, shareable links</p>
          <div className="mt-3 md:mt-4 mx-auto max-w-2xl px-2">
            <p className="text-gray-400 text-sm md:text-base">Our advanced link shortening technology creates compact URLs that are easy to share on social media, emails, and messages.</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-4 md:p-8 border border-gray-700 transition-all hover:shadow-blue-900/20">
          <div className="mb-5 md:mb-6">
            <label htmlFor="url" className="block text-blue-300 mb-2 text-base md:text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Enter your long URL
            </label>
            <input
              type="text"
              id="url"
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white text-sm md:text-base"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && (
              <p className="text-red-400 mt-2 text-xs md:text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800 disabled:text-blue-200 transform hover:translate-y-[-1px] active:translate-y-[0px] flex items-center justify-center"
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Shorten URL
              </span>
            )}
          </button>

          {shortUrl && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-blue-300 mb-2 md:mb-3 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Your shortened URL is ready:
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 p-2 md:p-3 border border-gray-600 rounded-l-lg focus:outline-none bg-gray-800 text-blue-200 text-sm md:text-base"
                />
                <button
                  onClick={handleCopy}
                  className={`px-3 md:px-5 py-2 md:py-3 border-t border-r border-b border-gray-600 rounded-r-lg transition-colors flex items-center ${copied
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3 md:mt-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <div className="text-red-300 text-xs md:text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  The URL will expire after 48 hours
                </div>
                <button
                  onClick={handleOpen}
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center text-sm md:text-base"
                >
                  Open Link
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 md:mt-10 border-t border-gray-700 pt-4 md:pt-6">
            <h2 className="text-lg md:text-xl text-blue-300 mb-2 md:mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-gray-400">
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-bold mb-1 text-base md:text-lg flex items-center">
                  <span className="bg-blue-900/50 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Paste
                </div>
                <p className="text-xs md:text-sm">Enter your long URL into the input field above</p>
              </div>
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-bold mb-1 text-base md:text-lg flex items-center">
                  <span className="bg-blue-900/50 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Shorten
                </div>
                <p className="text-xs md:text-sm">Click the button and get your short URL instantly</p>
              </div>
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-blue-400 font-bold mb-1 text-base md:text-lg flex items-center">
                  <span className="bg-blue-900/50 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Share
                </div>
                <p className="text-xs md:text-sm">Copy and share your shortened URL with anyone</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 md:mt-16 text-center text-gray-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} URL Shortener Service. All rights reserved.</p>
          <p className="mt-2">Fast, reliable, and secure link shortening.</p>
        </footer>
      </div>
    </div>
  )
}

export default Home