export function calculateSplit(amount, paidBy, participants) {

  const share = amount / participants.length

  const balances = participants
    .filter(person => person !== paidBy)
    .map(person => ({
      from: person,
      to: paidBy,
      amount: share
    }))

  return balances
}