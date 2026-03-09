import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SplitExpenses(){

 const navigate = useNavigate()

 const [amount,setAmount] = useState("")
 const [payer,setPayer] = useState("")
 const [participants,setParticipants] = useState("")
 const [result,setResult] = useState([])



 function calculateSplit(){

  const people = participants
   .split(",")
   .map(p=>p.trim())
   .filter(Boolean)



  if(!amount || !payer || people.length===0) return



  const share = amount / people.length



  const debts = people
   .filter(p=>p!==payer)
   .map(p=>`${p} owes ${payer} ₹${share.toFixed(0)}`)



  setResult(debts)

 }



 return(

 <div className="app">

  <button
   onClick={()=>navigate("/")}
   style={{marginBottom:"20px"}}
  >
   ← Back
  </button>



  <div className="card">

   <h2>Split With Friends</h2>



   <input
    placeholder="Total Amount"
    type="number"
    value={amount}
    onChange={(e)=>setAmount(e.target.value)}
   />



   <input
    placeholder="Paid By"
    value={payer}
    onChange={(e)=>setPayer(e.target.value)}
   />



   <input
    placeholder="Participants (comma separated)"
    value={participants}
    onChange={(e)=>setParticipants(e.target.value)}
   />



   <button onClick={calculateSplit}>
    Calculate Split
   </button>

  </div>



  {result.length>0 &&(

   <div className="card">

    {result.map((r,i)=>(
     <p key={i}>{r}</p>
    ))}

   </div>

  )}

 </div>

 )

}