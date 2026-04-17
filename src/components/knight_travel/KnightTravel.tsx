import { useState, useEffect } from 'react'

function Board({ positions, currentStep }: { positions: number[][], currentStep: number }) {
    const size = 8;
    const squares = [];

    // Find the current position
    let currentRow = -1, currentCol = -1
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (positions[row][col] === currentStep) {
                currentRow = row
                currentCol = col
                break
            }
        }
        if (currentRow !== -1) break
    }

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const isDark = (row + col) % 2 === 1;
            const isVisited = positions[row][col] > -1
            const isCurrent = row === currentRow && col === currentCol

            let cellColour = isDark ? "#769656" : "#eeeed2"
            if (isVisited && !isCurrent) {
                cellColour = isDark ? 'lightblue' : 'aliceblue'
            }
            if (isCurrent) {
                cellColour = isDark ? '#4a90e2' : '#6bb6ff'
            }

            squares.push(
                <div
                    key={`${row}-${col}`}
                    style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: cellColour,
                        margin: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    {isCurrent && <span style={{
                        fontSize: '60px', color: 'black', width: '40px', height: '40px', lineHeight: '40px', textAlign: 'center', position: 'absolute'
                    }}>♞</span>}
                    {isVisited && <span style={{
                        fontSize: '12px', color: isDark ? '#333' : '#666', fontWeight: 'bold', position: 'absolute', zIndex: isCurrent ? 0 : 1
                    }}>{positions[row][col] + 1}</span>}
                </div>
            );
        }
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size}, 50px)`,
                gridTemplateRows: `repeat(${size}, 50px)`,
                border: "2px solid #333",
                width: "fit-content",
            }}
        >
            {squares}
        </div>
    );
}

// valid moves list (L-shaped knight moves)
const KNIGHT_MOVES = [
    [2, 1],      // 2 moves across and 1 down
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],    // 2 moves to the left and 1 up
    [-1, -2],
    [1, -2],
    [2, -1]
]

type AlgorithmState = {
    board: number[][]
    stack: {row: number, col: number, step: number, triedMoves: number}[]
    currentRow: number
    currentCol: number
    currentStep: number
    isBacktracking: boolean
    isComplete: boolean
    totalMoves: number
}

function createInitialState(size: number): AlgorithmState {
    const board: number[][] = []
    for (let row = 0; row < size; row++) {
        board.push(Array(size).fill(-1))
    }
    board[0][0] = 0

    return {
        board,
        stack: [{row: 0, col: 0, step: 0, triedMoves: 0}],
        currentRow: 0,
        currentCol: 0,
        currentStep: 0,
        isBacktracking: false,
        isComplete: false,
        totalMoves: 1
    }
}

function isMoveValid(row: number, col: number, size: number, board: number[][]): boolean {
    return row >= 0 && row < size && col >= 0 && col < size && board[row][col] === -1
}

function stepAlgorithm(state: AlgorithmState, size: number): AlgorithmState {
    if (state.isComplete) return state

    const newBoard = state.board.map(row => [...row])
    const newStack = [...state.stack]
    let { currentRow, currentCol, currentStep, totalMoves } = state

    // Check if we've completed the tour
    if (currentStep === size * size - 1) {
        return { ...state, isComplete: true, isBacktracking: false }
    }

    // Get current position from stack
    const current = newStack[newStack.length - 1]

    // Get all valid moves from current position (in order)
    const validMoves: {row: number, col: number}[] = []
    for (let i = 0; i < KNIGHT_MOVES.length; i++) {
        const [dr, dc] = KNIGHT_MOVES[i]
        const newRow = currentRow + dr
        const newCol = currentCol + dc
        if (isMoveValid(newRow, newCol, size, newBoard)) {
            validMoves.push({
                row: newRow,
                col: newCol
            })
        }
    }

    // Check if there's an untried valid move
    if (current.triedMoves < validMoves.length) {
        // Try the next move
        const move = validMoves[current.triedMoves]
        current.triedMoves++

        const nextStep = currentStep + 1
        newBoard[move.row][move.col] = nextStep
        newStack.push({row: move.row, col: move.col, step: nextStep, triedMoves: 0})

        return {
            board: newBoard,
            stack: newStack,
            currentRow: move.row,
            currentCol: move.col,
            currentStep: nextStep,
            isBacktracking: false,
            isComplete: false,
            totalMoves: totalMoves + 1
        }
    } else {
        // No more moves to try, backtrack
        if (newStack.length <= 1) {
            // Can't backtrack further, algorithm failed (shouldn't happen with good starting position)
            return { ...state, isComplete: true }
        }

        // Remove current position
        newBoard[currentRow][currentCol] = -1
        newStack.pop()

        // Go back to previous position
        const prev = newStack[newStack.length - 1]

        return {
            board: newBoard,
            stack: newStack,
            currentRow: prev.row,
            currentCol: prev.col,
            currentStep: prev.step,
            isBacktracking: true,
            isComplete: false,
            totalMoves: totalMoves + 1
        }
    }
}

export function KnightTravel() {
    const size = 8
    const [state, setState] = useState<AlgorithmState>(() => createInitialState(size))
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(5) // milliseconds delay between moves

    // Animation timer
    useEffect(() => {
        if (!isPlaying || state.isComplete) {
            if (state.isComplete) {
                setIsPlaying(false)
            }
            return
        }

        const timer = setTimeout(() => {
            setState(prevState => stepAlgorithm(prevState, size))
        }, speed)

        return () => clearTimeout(timer)
    }, [isPlaying, state, size, speed])

    const handlePlay = () => {
        setIsPlaying(true)
    }

    const handlePause = () => {
        setIsPlaying(false)
    }

    const handleReset = () => {
        setIsPlaying(false)
        setState(createInitialState(size))
    }

    const handleSolve = () => {
        setIsPlaying(false)
        let currentState = createInitialState(size)

        // Run algorithm to completion
        while (!currentState.isComplete) {
            currentState = stepAlgorithm(currentState, size)
        }

        setState(currentState)
    }

    return (
        <>
            <h1>Knights Travel</h1>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handlePlay} disabled={isPlaying || state.isComplete}>
                    Play
                </button>
                <button onClick={handlePause} disabled={!isPlaying} style={{ marginLeft: '10px' }}>
                    Pause
                </button>
                <button onClick={handleSolve} disabled={state.isComplete} style={{ marginLeft: '10px' }}>
                    Solve
                </button>
                <button onClick={handleReset} style={{ marginLeft: '10px' }}>
                    Reset
                </button>
                <div style={{ marginTop: '15px' }}>
                    <label htmlFor="speed-slider" style={{ display: 'block', marginBottom: '5px' }}>
                        Speed: {speed}ms delay {speed <= 10 ? '(Very Fast)' : speed <= 50 ? '(Fast)' : speed <= 200 ? '(Medium)' : '(Slow)'}
                    </label>
                    <input
                        id="speed-slider"
                        type="range"
                        min="1"
                        max="1000"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        style={{ width: '300px' }}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <p>Squares Visited: {state.currentStep + 1} / {size * size}</p>
                    <p>Total moves: {state.totalMoves}</p>
                    <p style={{ color: state.isBacktracking ? 'red' : 'green', fontWeight: 'bold' }}>
                        Status: {state.isBacktracking ? '⬅ Backtracking' : '➡ Moving Forward'}
                    </p>
                    {state.isComplete && <p style={{ color: 'green', fontWeight: 'bold' }}>
                        ✓ Knight's tour complete! All {size * size} squares visited.
                    </p>}
                </div>
            </div>
            <Board positions={state.board} currentStep={state.currentStep} />
        </>
    )
}