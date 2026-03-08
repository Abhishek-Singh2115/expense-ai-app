import express from "express"
import cors from "cors"
import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/* -------- Fake AI fallback -------- */

function generateFakeAI(message, expenses){

  if(!expenses || expenses.length === 0){
    return "You haven't added any expenses yet."
  }

  const total = expenses.reduce((sum,e)=> sum + Number(e.amount),0)

  const highest = expenses.reduce((max,e)=>
    Number(e.amount) > Number(max.amount) ? e : max
  )

  const categories = {}

  expenses.forEach(e=>{
    categories[e.category] = (categories[e.category] || 0) + Number(e.amount)
  })

  const mostCategory = Object.entries(categories).sort((a,b)=>b[1]-a[1])[0]

  return `
Total spending: ₹${total}

Highest single expense:
${highest.name} (₹${highest.amount})

Most spent category:
${mostCategory[0]} (₹${mostCategory[1]})

Suggestion:
Try reducing spending in ${mostCategory[0]} to save more money.
`
}

/* -------- AI Endpoint -------- */

app.post("/chat", async (req,res)=>{

  const {message,expenses} = req.body

  try{

    const response = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      messages:[
        {
          role:"system",
          content:"You are a financial advisor helping users analyze spending."
        },
        {
          role:"user",
          content:`User expenses: ${JSON.stringify(expenses)}. Question: ${message}`
        }
      ]

    })

    res.json({
      reply: response.choices[0].message.content
    })

  }catch(err){

    console.log("⚠ AI unavailable — using fake AI")

    const fakeReply = generateFakeAI(message,expenses)

    res.json({
      reply: fakeReply
    })

  }

})

/* -------- Health Check -------- */

app.get("/",(req,res)=>{
  res.send("AI Expense Server Running")
})

/* -------- Start Server -------- */

app.listen(3001,()=>{
  console.log("🚀 AI server running on port 3001")
})