const History = ({ transactions }) => {

  return (
    <div>
      <ul>
        {transactions.map(t => <li key={t.id}>{t.name}: { t.type === 'income' ? '+' : '-'} ${ t.amount}</li>)}
      </ul>
    </div>
  )
}

export default History