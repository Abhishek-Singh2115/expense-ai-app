import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState, useEffect } from "react"

import "./index.css"

import { CATEGORIES } from "./data/categories"
import { today, getMonthKey, monthLabel } from "./utils/dateUtils"

import ExpenseItem from "./components/ExpenseItem"
import ExpenseChart from "./components/ExpenseChart"
import ChatBot from "./components/ChatBot"

import { generateInsights } from "./ai/aiInsights"

import SplitExpenses from "./pages/SplitExpenses"



function Dashboard() {

    const [expenses, setExpenses] = useState(() => {

        const saved = localStorage.getItem("expenses")
        return saved ? JSON.parse(saved) : []

    })

    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("Food")
    const [date, setDate] = useState(today())

    const [budget, setBudget] = useState(() => {
        const saved = localStorage.getItem("budget")
        return saved ? Number(saved) : 0
    })

    const [theme, setTheme] = useState("dark")

    const [search, setSearch] = useState("")



    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses))
    }, [expenses])



    useEffect(() => {
        localStorage.setItem("budget", budget)
    }, [budget])



    useEffect(() => {
        document.body.className = theme
    }, [theme])



    function addExpense() {

        if (!title || amount <= 0) return

        setExpenses(prev => [
            ...prev,
            { id: Date.now(), title, amount, category, date }
        ])

        setTitle("")
        setAmount("")
    }



    function deleteExpense(id) {
        setExpenses(prev => prev.filter(e => e.id !== id))
    }



    const monthKey = getMonthKey(today())

    const monthlyExpenses =
        expenses.filter(e => getMonthKey(e.date) === monthKey)



    const filteredExpenses =
        monthlyExpenses.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase())
        )



    const monthTotal =
        monthlyExpenses.reduce((s, e) => s + Number(e.amount), 0)



    const remaining = budget - monthTotal



    const percent =
        budget ? Math.min((monthTotal / budget) * 100, 100) : 0



    const insight =
        generateInsights(monthlyExpenses)



    return (

        <div className="app">

            <div className="header">

                <h2>{monthLabel(monthKey)}</h2>

                <p>Spent: ₹{monthTotal}</p>
                <p>Budget: ₹{budget}</p>
                <p style={{ color: remaining < 0 ? "red" : "#00ff9d" }}>
                    Remaining: ₹{remaining}
                </p>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    Toggle Theme
                </button>

            </div>



            <div className="card">

                <input
                    type="number"
                    placeholder="Set Monthly Budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                />

                <p>Remaining ₹{remaining}</p>

                <div className="progress">

                    <div
                        className="progress-bar"
                        style={{ width: `${percent}%` }}
                    ></div>

                </div>

            </div>



            <div className="card">

                <input
                    placeholder="Search expenses"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>



            <div className="card">

                <input
                    placeholder="Expense name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >

                    {CATEGORIES.map(c => (
                        <option key={c}>{c}</option>
                    ))}

                </select>



                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />



                <button onClick={addExpense}>
                    Add Expense
                </button>



                <Link to="/split">

                    <button style={{ marginTop: "10px" }}>
                        Split With Friends
                    </button>

                </Link>

            </div>



            <div className="card">
                <ExpenseChart expenses={monthlyExpenses} />
            </div>



            <div className="card">
                <p>{insight}</p>
            </div>



            <div className="card">

                {filteredExpenses.map(e => (

                    <ExpenseItem
                        key={e.id}
                        e={e}
                        deleteExpense={deleteExpense}
                    />

                ))}

            </div>



            <ChatBot expenses={monthlyExpenses} />

        </div>

    )

}



export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Dashboard />} />

                <Route path="/split" element={<SplitExpenses />} />

            </Routes>

        </BrowserRouter>

    )

}