import { useState, useRef } from "react"

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

    const [gamesPlayed, setGamesPlayed] = useState<number>(0)
    const [gamesWon, setGamesWon] = useState<number>(0)
    const [simulationStats, setSimulationStats] = useState<{
        totalRolls: number
        highestRolls: number
        lowestRolls: number
        allRollValues: number[]
    } | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

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
            <div>
                <h2>Simulation</h2>
                <div>
                    <label htmlFor="num-games">Number of games to simulate: </label>
                    <input
                        id="num-games"
                        ref={inputRef}
                        type="number"
                        min="1"
                        defaultValue="10000"
                        style={{ width: '100px', marginRight: '10px' }}
                    />
                    <button onClick={handleSimulate}>Run Simulation</button>
                </div>
            </div>

            <div>
                <h2>Stats</h2>
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