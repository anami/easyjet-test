// Dice characters are from: https://emojicombos.com/dice

import { useState } from "react"

function Die({ value }: { value: number }) {
    const diceChars = '⚀⚁⚂⚃⚄⚅'
    return <div>{diceChars.charAt(value - 1)}</div>
}

export function Craps() {

    const [diceValues, setDiceValues] = useState<number[] | null>(null)


    function handleRoll() {


        // randomly generate two numbers 
        const val1 = Math.floor(Math.random() * 6) + 1
        const val2 = Math.floor(Math.random() * 6) + 1
        
        setDiceValues(
            [val1, val2]
        )

    }

    return (
        <>
            <h1>Craps</h1>
            {diceValues && (
                <div className="dice">
                    <div style={{
                        fontSize: '60px',
                        width: '100px',
                        height: '100px',
                        color: 'yellow',
                        display: 'flex'
                    }}>
                        <Die value={diceValues[0]} />
                        <Die value={diceValues[1]} />
                    </div>
                </div>)}
            <div>
                <button onClick={handleRoll}>Roll</button>
            </div>
        </>
    )

}