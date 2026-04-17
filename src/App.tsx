import { useState } from 'react'
import './App.css'
import { FizzBuzz } from './components/fizzbuzz/FizzBuzz'
import { KnightTravel } from './components/knight_travel/KnightTravel'
import { Craps } from './components/craps/Craps'

type TestType = 'fizzbuzz' | 'knight' | 'craps'

function App() {
  const [testType, setTestType] = useState<TestType>('fizzbuzz')

  return (
    <>
      <h1>easyJet Holidays Engineer Test</h1>
      
      
      <section id="spacer"></section>

      <div className="tabs">
        <div role="tablist">
          <button role="tab" id="fizzbuzz" aria-selected={testType === 'fizzbuzz' ?  'true' : 'false'} onClick={() => setTestType('fizzbuzz')}>FizzBuzz</button>
          <button role="tab" id="knight" onClick={() => setTestType('knight')} aria-selected={testType === 'knight' ?  'true' : 'false'}>Knight Travel</button>
          <button role="tab" id="craps" onClick={() => setTestType('craps')} aria-selected={testType === 'craps' ?  'true' : 'false'}>Craps</button>
        </div>
      </div>


      {testType === 'fizzbuzz' && <FizzBuzz />}
      {testType === 'knight' && <KnightTravel />}
      {testType === 'craps' && <Craps />}
      
    </>
  )
}

export default App
