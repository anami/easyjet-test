// Dice characters are from: https://emojicombos.com/dice

import { useState, useRef } from "react"

function Die({ value }: { value: number }) {
    const diceChars = '⚀⚁⚂⚃⚄⚅'
    return <div>{diceChars.charAt(value - 1)}</div>
}

function getMostCommonRoll(rollValues: number[]): string {
    const counts: { [key: number]: number } = {}

    for (const value of rollValues) {
        counts[value] = (counts[value] || 0) + 1
    }

    let mostCommon = 0
    let maxCount = 0

    for (const [value, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count
            mostCommon = parseInt(value)
        }
    }

    return `${mostCommon} (${maxCount} times)`
}

export function Craps() {

    const [diceValues, setDiceValues] = useState<number[] | null>(null)
    const [gamesPlayed, setGamesPlayed] = useState<number>(0)
    const [gamesWon, setGamesWon] = useState<number>(0)
    const [gamesLost, setGamesLost] = useState<number>(0)
    const [point, setPoint] = useState<number | null>(null)
    const [simulationStats, setSimulationStats] = useState<{
        totalRolls: number
        highestRolls: number
        lowestRolls: number
        allRollValues: number[]
    } | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)


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
                setGamesPlayed(prev => prev + 1)
                setGamesLost(prev => prev + 1)
            } else if (winningTotals.includes(total)) {
                setGamesWon(prev => prev + 1)
                setGamesPlayed(prev => prev + 1)
            } else if (continueTotals.includes(total)) {
                // Set the point and continue playing
                setPoint(total)
            }
        } else {
            // Point is set, check if we match the point or roll a 7
            if (total === point) {
                // Matched the point, win!
                setGamesWon(prev => prev + 1)
                setGamesPlayed(prev => prev + 1)
                setPoint(null)
            } else if (total === 7) {
                // Rolled a 7, lose
                setGamesLost(prev => prev + 1)
                setGamesPlayed(prev => prev + 1)
                setPoint(null)
            }
            // Otherwise continue rolling
        }
    }

    function simulateGames(numGames: number) {
        let wins = 0
        let losses = 0
        let totalRolls = 0
        let highestRolls = 0
        let lowestRolls = Infinity
        const allRollValues: number[] = []

        for (let i = 0; i < numGames; i++) {
            // Simulate one game
            let gameRolls = 0
            let gamePoint: number | null = null

            while (true) {
                // Roll dice
                const val1 = Math.floor(Math.random() * 6) + 1
                const val2 = Math.floor(Math.random() * 6) + 1
                const total = val1 + val2
                gameRolls++
                allRollValues.push(total)

                if (gamePoint === null) {
                    // First roll
                    if (total === 7 || total === 11) {
                        wins++
                        break
                    } else if (total === 2 || total === 3 || total === 12) {
                        losses++
                        break
                    } else {
                        gamePoint = total
                    }
                } else {
                    // Point is set
                    if (total === gamePoint) {
                        wins++
                        break
                    } else if (total === 7) {
                        losses++
                        break
                    }
                }
            }

            totalRolls += gameRolls
            if (gameRolls > highestRolls) highestRolls = gameRolls
            if (gameRolls < lowestRolls) lowestRolls = gameRolls
        }

        // Update stats
        setGamesPlayed(numGames)
        setGamesWon(wins)
        setGamesLost(losses)
        setSimulationStats({
            totalRolls,
            highestRolls,
            lowestRolls,
            allRollValues
        })
    }

    function handleSimulate() {
        if (!inputRef.current) return

        const numGames = parseInt(inputRef.current.value)
        if (isNaN(numGames) || numGames < 1) {
            alert('Please enter a valid number of games')
            return
        }

        simulateGames(numGames)
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

            <div style={{ marginTop: '30px', marginBottom: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <h2>Simulation</h2>
                <div>
                    <label htmlFor="num-games">Number of games to simulate: </label>
                    <input
                        id="num-games"
                        ref={inputRef}
                        type="number"
                        min="1"
                        defaultValue="1000"
                        style={{ width: '100px', marginRight: '10px' }}
                    />
                    <button onClick={handleSimulate}>Run Simulation</button>
                </div>
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
                {gamesPlayed > 0 && (
                    <p>
                        Winning percentage: {((gamesWon / gamesPlayed) * 100).toFixed(2)}%
                    </p>
                )}
                {simulationStats && (
                    <>
                        <p>
                            Average rolls per game: {(simulationStats.totalRolls / gamesPlayed).toFixed(2)}
                        </p>
                        <p>
                            Highest number of rolls: {simulationStats.highestRolls}
                        </p>
                        <p>
                            Lowest number of rolls: {simulationStats.lowestRolls}
                        </p>
                        <p>
                            Most common roll: {getMostCommonRoll(simulationStats.allRollValues)}
                        </p>
                    </>
                )}
            </div>
        </>
    )

}