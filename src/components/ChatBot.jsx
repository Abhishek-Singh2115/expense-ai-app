import { useState } from "react"

export default function ChatBot({ expenses }) {

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  function generateFakeAI(message, expenses) {

    if (!expenses || expenses.length === 0) {
      return "Add some expenses first so I can analyze your spending."
    }

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

    const categoryTotals = {}

    expenses.forEach(e => {
      if (!categoryTotals[e.category]) {
        categoryTotals[e.category] = 0
      }
      categoryTotals[e.category] += Number(e.amount)
    })

    const biggestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    )

    const msg = message.toLowerCase()

    if (msg.includes("save")) {
      return `Your biggest spending category is ${biggestCategory}. Try reducing spending there to save more money.`
    }

    if (msg.includes("total") || msg.includes("spend")) {
      return `You have spent ₹${total} in total. Your highest spending category is ${biggestCategory}.`
    }

    if (msg.includes("rent")) {
      return "Rent usually takes a large portion of income. Try keeping rent below 30% of your monthly income."
    }

    if (msg.includes("food")) {
      return "Food expenses can grow quickly. Try cooking at home more often to reduce spending."
    }

    if (msg.includes("budget")) {
      return "A good rule is the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
    }

    if (total > 20000) {
      return `Your spending is quite high (₹${total}). Consider reviewing your ${biggestCategory} expenses.`
    }

    return `Your total spending is ₹${total}. Your biggest category is ${biggestCategory}. Keep tracking expenses regularly!`
  }

  function askAI() {

    if (!question.trim()) return

    setLoading(true)

    setTimeout(() => {

      const reply = generateFakeAI(question, expenses)

      setAnswer(reply)

      setLoading(false)

    }, 600)
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