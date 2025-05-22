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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-3 md:p-4 text-white">
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-50 ${
          toast.type === 'success' 
            ? 'bg-green-600 text-emerald-50' 
            : 'bg-red-600 text-rose-50'
          } backdrop-blur-sm bg-opacity-90`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-8 md:pt-16">
        <div className="text-center mb-10 md:mb-14">
          <div className="mb-4">
            <span className="inline-block p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Link2 className="h-8 w-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-3 md:mb-4">
            URL Shortener
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-3">
            Transform your long, unwieldy URLs into concise, shareable links
          </p>
          <div className="mt-3 md:mt-4 mx-auto max-w-2xl px-2">
            <p className="text-gray-400 text-sm md:text-base">
              Our advanced link shortening technology creates compact URLs that are easy to share 
              on social media, emails, and messages while providing detailed analytics.
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 border border-gray-800 transition-all hover:shadow-indigo-900/20 hover:border-gray-700">
          <div className="mb-5 md:mb-6">
            <label htmlFor="url" className="block text-white mb-2 text-base md:text-lg font-medium">
              <Link2 className="h-5 w-5 inline-block mr-2 text-indigo-400" />
              Enter your long URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-800/80 text-white text-sm md:text-base placeholder-gray-500 transition-all"
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {url && <ExternalLink className="h-4 w-4 text-gray-400" />}
              </div>
            </div>
            {error && (
              <p className="text-red-400 mt-2 text-xs md:text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 md:py-4 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center shadow-lg shadow-indigo-900/30"
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
            <div className="mt-8 md:mt-10 p-5 md:p-6 bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg shadow-purple-900/10 backdrop-blur-sm">
              <p className="text-white mb-3 md:mb-4 font-medium flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-purple-400" />
                Your shortened URL is ready:
              </p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 p-3 md:p-4 border border-gray-700 rounded-l-lg focus:outline-none bg-gray-900/80 text-white text-sm md:text-base"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 md:px-6 py-3 md:py-4 border-t border-r border-b border-gray-700 rounded-r-lg transition-all flex items-center ${
                    copied 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  } shadow-md`}
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-4 md:mt-5 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <div className="text-amber-300/90 text-xs md:text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  This shortened URL will expire after 48 hours
                </div>
                <button
                  onClick={handleOpen}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors flex items-center text-sm md:text-base group"
                >
                  Open Link
                  <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 md:mt-12 border-t border-gray-800 pt-6 md:pt-8">
            <h2 className="text-lg md:text-xl text-white mb-4 md:mb-5 flex items-center">
              <Info className="h-5 w-5 mr-2 text-indigo-400" />
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 md:p-5 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="text-white font-bold mb-2 text-base md:text-lg flex items-center">
                  <div className="bg-indigo-600/20 p-2 rounded-full mr-3">
                    <Clipboard className="h-5 w-5 text-indigo-400" />
                  </div>
                  Paste
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Enter your long URL into the input field above and get ready to transform it
                </p>
              </div>
              <div className="p-4 md:p-5 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="text-white font-bold mb-2 text-base md:text-lg flex items-center">
                  <div className="bg-purple-600/20 p-2 rounded-full mr-3">
                    <Scissors className="h-5 w-5 text-purple-400" />
                  </div>
                  Shorten
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Click the button and our system will generate a compact URL instantly
                </p>
              </div>
              <div className="p-4 md:p-5 bg-gray-800/30 rounded-lg border border-gray-800 hover:border-gray-700 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="text-white font-bold mb-2 text-base md:text-lg flex items-center">
                  <div className="bg-indigo-600/20 p-2 rounded-full mr-3">
                    <Share2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  Share
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Copy and share your shortened URL easily across any platform or device
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 md:mt-16 text-center">
          <div className="p-6 rounded-lg bg-gray-900/30 backdrop-blur-sm border border-gray-800">
            <p className="text-gray-400 text-xs md:text-sm">
              © {new Date().getFullYear()} URL Shortener Service. All rights reserved.
            </p>
            <p className="mt-2 text-gray-500 text-xs">
              Fast, reliable, and secure link shortening for professionals and personal use.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
