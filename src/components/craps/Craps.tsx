// Dice characters are from: https://emojicombos.com/dice

import { useState } from "react"

function Die({ value }: { value: number }) {
    const diceChars = '⚀⚁⚂⚃⚄⚅'
    return <div>{diceChars.charAt(value - 1)}</div>
}

export function Craps() {

    const [diceValues, setDiceValues] = useState<number[] | null>(null)
    const [gamesPlayed, setGamesPlayed] = useState<number>(0)
    const [playing, setPlaying] = useState<boolean>(false)
    const [gamesWon, setGamesWon] = useState<number>(0)
    const [gamesLost, setGamesLost] = useState<number>(0)


    function handleRoll() {
        // randomly generate two numbers 
        const val1 = Math.floor(Math.random() * 6) + 1
        const val2 = Math.floor(Math.random() * 6) + 1

        const losingTotals = [2, 3, 12]
        const winningTotals = [7, 11]
        const continueTotals = [4, 5, 6, 8, 9, 10]


        const total = val1 + val2

        // check if the player lost - if the values add up to 2, 3 and 12
        if (losingTotals.includes(total)) {
            // game is lost
            setPlaying(false)
            setGamesPlayed(prev => prev + 1)
            setGamesLost(prev => prev + 1)
        } else if (winningTotals.includes(total)) {
            setGamesWon(prev => prev + 1)
            setGamesPlayed(prev => prev + 1)
            setPlaying(false)
        }


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
            <div>
                <h2>Stats</h2>
                <p>
                    Game in progress: {playing}
                </p>
                <p>
                    Games played: {gamesPlayed}
                </p>
                <p>
                    Games won: {gamesWon}
                </p>
                <p>
                    Games lost: {gamesLost}
                </p>
            </div>
        </>
    )

}