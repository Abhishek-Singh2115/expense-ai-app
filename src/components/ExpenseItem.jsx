import { formatDate } from "../utils/dateUtils"
import { CATEGORY_COLORS } from "../data/categories"

export default function ExpenseItem({e,editExpense,deleteExpense}){

 return(

  <div className="expense">

   <div>

    <div className="expense-title">

     <span
      className="chip"
      style={{background:CATEGORY_COLORS[e.category]}}
     >
      {e.category}
     </span>

     {e.title}

    </div>

    <div className="expense-date">
     {formatDate(e.date)}
    </div>

   </div>

   <div className="expense-right">

    <div className="expense-amount">
     ₹{e.amount}
    </div>

    <div className="actions">

     <button
      className="edit-btn"
      onClick={()=>editExpense(e)}
     >
      ✎
     </button>

     <button
      className="delete-btn"
      onClick={()=>deleteExpense(e.id)}
     >
      ✕
     </button>

    </div>

   </div>

  </div>

 )

}