import { PieChart,Pie,Cell } from "recharts"
import { CATEGORY_COLORS } from "../data/categories"

export default function ExpenseChart({expenses}){

 const data={}

 expenses.forEach(e=>{
  data[e.category]=(data[e.category]||0)+Number(e.amount)
 })

 const chartData =
  Object.entries(data).map(([k,v])=>({
   name:k,
   value:v
  }))

 return(

 <PieChart width={350} height={280}>

  <Pie
   data={chartData}
   dataKey="value"
   outerRadius={100}
   label
  >

   {chartData.map((entry,i)=>(
    <Cell
     key={i}
     fill={CATEGORY_COLORS[entry.name]}
    />
   ))}

  </Pie>

 </PieChart>

 )

}