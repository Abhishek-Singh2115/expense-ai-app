export function today(){
 return new Date().toISOString().split("T")[0]
}

export function getMonthKey(dateStr){
 const d = new Date(dateStr)
 return `${d.getFullYear()}-${d.getMonth()}`
}

export function monthLabel(key){
 const [y,m] = key.split("-")

 return new Date(y,m).toLocaleDateString("en-US",{
  month:"long",
  year:"numeric"
 })
}

export function formatDate(dateStr){

 const d = new Date(dateStr)

 return d.toLocaleDateString("en-GB",{
  day:"2-digit",
  month:"short",
  year:"numeric"
 })

}