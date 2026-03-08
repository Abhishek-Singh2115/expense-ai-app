import { useState,useEffect } from "react"

import "./index.css"

import { CATEGORIES } from "./data/categories"
import { today,getMonthKey,monthLabel } from "./utils/dateUtils"

import ExpenseItem from "./components/ExpenseItem"
import ExpenseChart from "./components/ExpenseChart"
import ChatBot from "./components/ChatBot"

import { generateInsights } from "./ai/aiInsights"

export default function App(){

 const [expenses,setExpenses] = useState(()=>{

  const saved = localStorage.getItem("expenses")

  return saved ? JSON.parse(saved) : []

 })

 const [title,setTitle] = useState("")
 const [amount,setAmount] = useState("")
 const [category,setCategory] = useState("Food")
 const [date,setDate] = useState(today())

 const [budget,setBudget] = useState(5000)
 const [theme,setTheme] = useState("dark")

 const [search,setSearch] = useState("")

 useEffect(()=>{
  localStorage.setItem("expenses",JSON.stringify(expenses))
 },[expenses])

 useEffect(()=>{
  document.body.className = theme
 },[theme])

 function addExpense(){

  if(!title || amount<=0) return

  setExpenses(prev=>[
   ...prev,
   {id:Date.now(),title,amount,category,date}
  ])

  setTitle("")
  setAmount("")

 }

 function deleteExpense(id){

  setExpenses(prev=>prev.filter(e=>e.id!==id))

 }

 const monthKey = getMonthKey(today())

 const monthlyExpenses =
  expenses.filter(e=>getMonthKey(e.date)===monthKey)

 const filteredExpenses =
  monthlyExpenses.filter(e=>
   e.title.toLowerCase().includes(search.toLowerCase())
  )

 const monthTotal =
  monthlyExpenses.reduce((s,e)=>s+Number(e.amount),0)

 const remaining = budget - monthTotal

 const percent =
  Math.min((monthTotal/budget)*100,100)

 const insight =
  generateInsights(monthlyExpenses)

 return(

 <div className="app">

  <div className="header">

   <h2>{monthLabel(monthKey)}</h2>
   <h1>₹{monthTotal}</h1>

   <button
    onClick={()=>setTheme(theme==="dark"?"light":"dark")}
   >
    Toggle Theme
   </button>

  </div>

  <div className="card">

   <h3>Budget ₹{budget}</h3>

   <p>Remaining ₹{remaining}</p>

   <div className="progress">

    <div
     className="progress-bar"
     style={{width:`${percent}%`}}
    ></div>

   </div>

  </div>

  <div className="card">

   <input
    placeholder="Search expenses"
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
   />

  </div>

  <div className="card">

   <input
    placeholder="Expense name"
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
   />

   <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e)=>setAmount(e.target.value)}
   />

   <select
    value={category}
    onChange={(e)=>setCategory(e.target.value)}
   >

   {CATEGORIES.map(c=>(
    <option key={c}>{c}</option>
   ))}

   </select>

   <input
    type="date"
    value={date}
    onChange={(e)=>setDate(e.target.value)}
   />

   <button onClick={addExpense}>
    Add Expense
   </button>

  </div>

  <div className="card">
   <ExpenseChart expenses={monthlyExpenses}/>
  </div>

  <div className="card">
   <p>{insight}</p>
  </div>

  <div className="card">

   {filteredExpenses.map(e=>(
    <ExpenseItem
     key={e.id}
     e={e}
     deleteExpense={deleteExpense}
    />
   ))}

  </div>

  <ChatBot expenses={monthlyExpenses}/>

 </div>

 )

}