import { useState } from "react"

export default function Home() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sentiment, setSentiment] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)

  // API endpoint - change this to your backend URL
  const API_URL = 'http://localhost:5000/api'

  const handleAnalyze = async () => {
    if (!text.trim() || isLoading) return

    setIsLoading(true)
    setSentiment(null)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze sentiment')
      }

      if (data.success) {
        setSentiment(data.data.sentiment)
        setConfidence(data.data.confidence)
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setSentiment('neutral')
      setConfidence(0)
    } finally {
      setIsLoading(false)
    }
  }

  const getBackgroundClass = () => {
    if (isLoading) return "from-slate-950 via-purple-950 to-slate-950"
    if (sentiment === "positive") return "from-emerald-950 via-teal-900 to-emerald-950"
    if (sentiment === "negative") return "from-rose-950 via-red-900 to-rose-950"
    if (sentiment === "neutral") return "from-blue-950 via-indigo-900 to-blue-950"
    return "from-slate-950 via-slate-900 to-slate-950"
  }

  const getSentimentIcon = () => {
    if (sentiment === "positive") {
      return (
        <svg style={{ width: "128px", height: "128px", animation: "bounce 1s infinite" }} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#6ee7b7" strokeWidth="2" />
          <circle cx="35" cy="40" r="5" fill="#6ee7b7" />
          <circle cx="65" cy="40" r="5" fill="#6ee7b7" />
          <path d="M 35 60 Q 50 75 65 60" stroke="#6ee7b7" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )
    }
    if (sentiment === "negative") {
      return (
        <svg style={{ width: "128px", height: "128px", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#fda4af" strokeWidth="2" />
          <circle cx="35" cy="40" r="5" fill="#fda4af" />
          <circle cx="65" cy="40" r="5" fill="#fda4af" />
          <path d="M 35 65 Q 50 55 65 65" stroke="#fda4af" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )
    }
    return (
      <svg style={{ width: "128px", height: "128px", animation: "spin 3s linear infinite" }} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="35" cy="40" r="5" fill="#93c5fd" />
        <circle cx="65" cy="40" r="5" fill="#93c5fd" />
        <line x1="35" y1="65" x2="65" y2="65" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        #root {
          width: 100%;
          min-height: 100vh;
        }

        .sentiment-container {
          min-height: 100vh;
          width: 100%;
          transition: background 1s ease-in-out;
          position: relative;
          background: linear-gradient(to bottom right, var(--bg-from), var(--bg-via), var(--bg-to));
          overflow: hidden;
        }

        .sentiment-container.bg-loading {
          --bg-from: #020617;
          --bg-via: #581c87;
          --bg-to: #020617;
        }

        .sentiment-container.bg-positive {
          --bg-from: #064e3b;
          --bg-via: #115e59;
          --bg-to: #064e3b;
        }

        .sentiment-container.bg-negative {
          --bg-from: #4c0519;
          --bg-via: #991b1b;
          --bg-to: #4c0519;
        }

        .sentiment-container.bg-neutral {
          --bg-from: #172554;
          --bg-via: #312e81;
          --bg-to: #172554;
        }

        .sentiment-container.bg-default {
          --bg-from: #020617;
          --bg-via: #0f172a;
          --bg-to: #020617;
        }

        .blob-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: blur(60px);
          opacity: 0.3;
          animation: blob 7s infinite;
        }

        .blob-1 {
          top: 80px;
          left: -160px;
          width: 384px;
          height: 384px;
          background: #a855f7;
        }

        .blob-2 {
          top: 160px;
          right: -128px;
          width: 384px;
          height: 384px;
          background: #06b6d4;
          animation-delay: 2s;
        }

        .blob-3 {
          bottom: -128px;
          left: 33.333%;
          width: 384px;
          height: 384px;
          background: #ec4899;
          animation-delay: 4s;
        }

        .blob-4 {
          bottom: 0;
          right: 0;
          width: 320px;
          height: 320px;
          background: #3b82f6;
          opacity: 0.2;
          animation-delay: 3s;
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-25%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8) rotateY(-10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .scale-in {
          animation: scaleIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .main-content {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          align-items: stretch;
        }

        .left-section, .right-section {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
        }

        @media (min-width: 768px) {
          .left-section, .right-section {
            padding: 48px;
          }
        }

        @media (min-width: 1024px) {
          .left-section, .right-section {
            padding: 64px;
          }
        }

        .content-wrapper {
          width: 100%;
          max-width: 448px;
          position: relative;
          z-index: 20;
        }

        .gradient-text {
          background: linear-gradient(to right, #60a5fa, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .textarea-wrapper {
          position: relative;
          margin-bottom: 32px;
          z-index: 30;
        }

        .textarea-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(to right, #2563eb, #7c3aed, #db2777);
          border-radius: 24px;
          filter: blur(8px);
          opacity: 0;
          transition: opacity 0.5s;
          z-index: 1;
        }

        .textarea-wrapper:hover .textarea-glow,
        .textarea-wrapper:focus-within .textarea-glow {
          opacity: 0.75;
          animation: pulse 1.5s infinite;
        }

        .textarea-container {
          position: relative;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: border-color 0.3s;
          overflow: hidden;
          z-index: 2;
        }

        .textarea-wrapper:hover .textarea-container {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .textarea-wrapper:focus-within .textarea-container {
          border-color: rgba(255, 255, 255, 0.6);
        }

        .textarea-inner-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), transparent, rgba(236, 72, 153, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1;
        }

        .textarea-wrapper:hover .textarea-inner-glow,
        .textarea-wrapper:focus-within .textarea-inner-glow {
          opacity: 1;
        }

        textarea {
          position: relative;
          width: 100%;
          height: 224px;
          background: transparent;
          padding: 32px;
          color: white;
          font-size: 18px;
          line-height: 1.75;
          border: none;
          outline: none;
          resize: none;
          z-index: 3;
        }

        textarea::placeholder {
          color: rgba(156, 163, 175, 0.7);
        }

        textarea:focus {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1);
        }

        .char-counter {
          position: absolute;
          bottom: 16px;
          right: 24px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          transition: color 0.3s;
          z-index: 4;
          pointer-events: none;
        }

        .textarea-wrapper:hover .char-counter {
          color: #9ca3af;
        }

        .analyze-button {
          width: 100%;
          padding: 20px 32px;
          background: linear-gradient(to right, #2563eb, #7c3aed, #db2777);
          color: white;
          font-weight: 700;
          font-size: 18px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          z-index: 30;
        }

        .analyze-button:hover:not(:disabled) {
          background: linear-gradient(to right, #1e40af, #6d28d9, #be185d);
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(168, 85, 247, 0.5);
        }

        .analyze-button:disabled {
          background: linear-gradient(to right, #374151, #374151, #374151);
          cursor: not-allowed;
          transform: scale(1);
        }

        .button-content {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .loading-dots {
          display: inline-flex;
          gap: 4px;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .result-card {
          border-radius: 24px;
          padding: 48px;
          backdrop-filter: blur(20px);
          border: 2px solid;
          transition: all 0.5s;
        }

        .result-card.positive {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(110, 231, 183, 0.5);
          box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2);
        }

        .result-card.negative {
          background: rgba(244, 63, 94, 0.15);
          border-color: rgba(253, 164, 175, 0.5);
          box-shadow: 0 25px 50px -12px rgba(244, 63, 94, 0.2);
        }

        .result-card.neutral {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(147, 197, 253, 0.5);
          box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.2);
        }

        .confidence-bar {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          height: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .confidence-fill {
          height: 100%;
          transition: width 1s ease-out;
        }

        .confidence-fill.positive {
          background: linear-gradient(to right, #34d399, #2dd4bf);
        }

        .confidence-fill.negative {
          background: linear-gradient(to right, #fb7185, #ef4444);
        }

        .confidence-fill.neutral {
          background: linear-gradient(to right, #60a5fa, #818cf8);
        }

        .ready-icon {
          width: 96px;
          height: 96px;
          margin: 0 auto 32px;
          color: #4b5563;
          opacity: 0.5;
        }

        h1 {
          font-size: 3rem;
          font-weight: 900;
          margin-top: 16px;
          color: white;
          line-height: 1.2;
        }

        h2 {
          font-size: 3rem;
          font-weight: 900;
          text-transform: capitalize;
          margin-bottom: 24px;
        }

        h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        @media (min-width: 768px) {
          h1 {
            font-size: 3.75rem;
          }
        }

        .tag {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .text-positive {
          color: #6ee7b7;
        }

        .text-negative {
          color: #fda4af;
        }

        .text-neutral {
          color: #93c5fd;
        }

        .text-gray {
          color: #9ca3af;
        }

        .text-gray-light {
          color: #d1d5db;
        }

        @media (max-width: 1023px) {
          .main-content {
            flex-direction: column;
          }
          .left-section, .right-section {
            width: 100%;
          }
        }
      `}</style>

      <div className={`sentiment-container bg-${isLoading ? 'loading' : sentiment || 'default'}`}>
        <div className="blob-background">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
        </div>

        <div className="main-content">
          <div className="left-section">
            <div className="content-wrapper">
              <div className="fade-in" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'inline-block' }}>
                  <span className="tag gradient-text">Analyze Now</span>
                </div>
                <h1>
                  What's Your <span className="gradient-text">Feeling?</span>
                </h1>
                <p className="text-gray" style={{ fontSize: '18px', marginTop: '16px' }}>
                  Share your thoughts and let AI reveal the emotion
                </p>
              </div>

              <div className="textarea-wrapper">
                <div className="textarea-glow"></div>
                <div className="textarea-container">
                  <div className="textarea-inner-glow"></div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your review, comment, or feedback here..."
                  />
                  <div className="char-counter">{text.length} / 500</div>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isLoading}
                className="analyze-button"
              >
                <span className="button-content">
                  {isLoading ? (
                    <>
                      <span>Analyzing</span>
                      <span className="loading-dots">
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                        <span className="loading-dot"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Analyze Sentiment
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="right-section">
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 1 }}>
              <div style={{ position: 'absolute', top: '50%', right: 0, width: '384px', height: '384px', background: 'linear-gradient(to left, white, transparent)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
            </div>

            <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
              {sentiment ? (
                <div className="scale-in">
                  <div className={`result-card ${sentiment}`}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                      {getSentimentIcon()}
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <p className="text-gray" style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Sentiment Result
                      </p>
                      <h2 className={`text-${sentiment}`}>{sentiment}</h2>

                      <div style={{ marginTop: '12px' }}>
                        <div className="confidence-bar">
                          <div className={`confidence-fill ${sentiment}`} style={{ width: `${confidence}%` }}></div>
                        </div>
                        <p className="text-gray-light" style={{ fontSize: '14px', marginTop: '12px' }}>
                          Confidence: <span style={{ fontWeight: 700, fontSize: '18px' }}>{confidence}%</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p className="text-gray" style={{ fontSize: '14px' }}>Try another text to analyze</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fade-in" style={{ textAlign: 'center' }}>
                  <svg className="ready-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3>Ready to Analyze?</h3>
                  <p className="text-gray">Enter your text on the left and click the button to discover the sentiment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
