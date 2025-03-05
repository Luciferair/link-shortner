import { useState, useEffect } from 'react'
import {
  Link2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Clipboard,
  Scissors,
  Share2,
  Clock,
  Info
} from 'lucide-react'
import { config } from '../config/env'

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
        setToast({ show: false, message: '', type: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [copied])

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
      const response = await fetch(`${config.api}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ URL: url })
      })

      console.log(config.api)
      console.log(config.url_redirect)
      console.log(response)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL')
      }

      setShortUrl(config.url_redirect+data.ShortURL)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true)
        setToast({ show: true, message: 'URL copied to clipboard!', type: 'success' })
      })
      .catch(() => {
        setToast({ show: true, message: 'Failed to copy', type: 'error' })
      })
  }

  const handleOpen = () => {
    window.open(shortUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-black p-3 md:p-4 text-white">
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-8 md:pt-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 md:mb-3">
            <Link2 className="h-8 w-8 inline-block mr-2" />
            URL Shortener
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Transform your long, unwieldy URLs into concise, shareable links
          </p>
          <div className="mt-3 md:mt-4 mx-auto max-w-2xl px-2">
            <p className="text-gray-400 text-sm md:text-base">
              Our advanced link shortening technology creates compact URLs that are easy to share on social media, emails, and messages.
            </p>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-2xl p-4 md:p-8 border border-gray-700 transition-all hover:shadow-gray-700">
          <div className="mb-5 md:mb-6">
            <label htmlFor="url" className="block text-white mb-2 text-base md:text-lg">
              <Link2 className="h-5 w-5 inline-block mr-1" />
              Enter your long URL
            </label>
            <input
              type="text"
              id="url"
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-gray-800 text-white text-sm md:text-base"
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && (
              <p className="text-red-400 mt-2 text-xs md:text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <button
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 md:py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:text-gray-400 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center"
            onClick={handleShorten}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Shorten URL
              </span>
            )}
          </button>

          {shortUrl && (
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-white mb-2 md:mb-3 font-medium flex items-center">
                <ExternalLink className="h-5 w-5 mr-1" />
                Your shortened URL is ready:
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 p-2 md:p-3 border border-gray-600 rounded-l-lg focus:outline-none bg-gray-900 text-white text-sm md:text-base"
                />
                <button
                  onClick={handleCopy}
                  className={`px-3 md:px-5 py-2 md:py-3 border-t border-r border-b border-gray-600 rounded-r-lg transition-colors flex items-center ${copied ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3 md:mt-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <div className="text-red-300 text-xs md:text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  The URL will expire after 48 hours
                </div>
                <button
                  onClick={handleOpen}
                  className="text-gray-300 hover:text-gray-200 transition-colors flex items-center text-sm md:text-base"
                >
                  Open Link
                  <ExternalLink className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 md:mt-10 border-t border-gray-700 pt-4 md:pt-6">
            <h2 className="text-lg md:text-xl text-white mb-2 md:mb-3 flex items-center">
              <Info className="h-5 w-5 mr-1" />
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-white font-bold mb-1 text-base md:text-lg flex items-center">
                  <Clipboard className="h-6 w-6 text-white mr-2" />
                  Paste
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Enter your long URL into the input field above
                </p>
              </div>
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-white font-bold mb-1 text-base md:text-lg flex items-center">
                  <Scissors className="h-6 w-6 text-white mr-2" />
                  Shorten
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Click the button and get your short URL instantly
                </p>
              </div>
              <div className="p-3 md:p-4 bg-gray-800/50 rounded-lg">
                <div className="text-white font-bold mb-1 text-base md:text-lg flex items-center">
                  <Share2 className="h-6 w-6 text-white mr-2" />
                  Share
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Copy and share your shortened URL with anyone
                </p>
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
