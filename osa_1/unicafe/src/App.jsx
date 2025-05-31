import { useState } from 'react'

const StatisticLine = (props) => (
  <div>
    {props.text}    {props.value}
  </div>
)
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const Statistics = ( {good, neutral, bad }) => {


  const calcTotal = () => {
    return (good + neutral + bad)
  }
  const calcAvg = () => {
    return ((good - bad) / (good + neutral + bad))
  }
  const calcPos = () => {
    return ((good / (good + neutral + bad)) * 100)
  }

  if ( good + neutral + bad != 0 ) { 
    return (
    <div>
      <td>
        <tr>good    {good}</tr>
        <tr>neutral {neutral}</tr>
        <tr>bad     {bad}</tr>
        <tr><StatisticLine text="all"   value={calcTotal()}/></tr>
        <tr><StatisticLine text="average" value={calcAvg()}/></tr>
        <tr><StatisticLine text="positive" value={calcPos()}/></tr>
      </td>
    </div>
    )
  } 
  return (
      <div>
      <p>No feedback given</p>
      </div>
    )
  }
const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App