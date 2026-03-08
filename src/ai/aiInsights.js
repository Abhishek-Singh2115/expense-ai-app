export function generateInsights(expenses){

 if(!expenses.length)
  return "Add expenses to see AI insights."

 const total =
  expenses.reduce((s,e)=>s+Number(e.amount),0)

 const categories={}

 expenses.forEach(e=>{
  categories[e.category] =
   (categories[e.category]||0)+Number(e.amount)
 })

 const highest =
  Object.entries(categories).sort((a,b)=>b[1]-a[1])[0]

 if(highest[1] > total*0.5){
  return `More than 50% of your spending is on ${highest[0]}`
 }

 return `You spend most on ${highest[0]} this month`

}