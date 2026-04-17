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
    const [point, setPoint] = useState<number | null>(null)


    function handleRoll() {
        // randomly generate two numbers
        const val1 = Math.floor(Math.random() * 6) + 1
        const val2 = Math.floor(Math.random() * 6) + 1

        const losingTotals = [2, 3, 12]
        const winningTotals = [7, 11]
        const continueTotals = [4, 5, 6, 8, 9, 10]

        const total = val1 + val2

        setDiceValues([val1, val2])

        // If no point is set, this is the first roll
        if (point === null) {
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
            } else if (continueTotals.includes(total)) {
                // Set the point and continue playing
                setPoint(total)
                setPlaying(true)
            }
        } else {
            // Point is set, check if we match the point or roll a 7
            if (total === point) {
                // Matched the point, win!
                setGamesWon(prev => prev + 1)
                setGamesPlayed(prev => prev + 1)
                setPlaying(false)
                setPoint(null)
            } else if (total === 7) {
                // Rolled a 7, lose
                setGamesLost(prev => prev + 1)
                setGamesPlayed(prev => prev + 1)
                setPlaying(false)
                setPoint(null)
            }
            // Otherwise continue rolling
        }
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
                    Point set: {point ?? 'NONE'}
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