import { useState } from "react"

export default function ChatBot({ expenses }) {

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  async function askAI() {

    if (!question.trim()) return

    setLoading(true)

    try {

      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: question,
          expenses: expenses
        })
      })

      const data = await response.json()

      setAnswer(data.reply)

    } catch (error) {

      console.error(error)
      setAnswer("Error contacting AI server")

    }

    setLoading(false)
  }

  return (

    <div className="card">

      <h3>AI Assistant</h3>

      <input
        placeholder="Ask about your spending"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askAI} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div style={{ marginTop: "10px" }}>
          <strong>AI:</strong> {answer}
        </div>
      )}

    </div>

  )
}