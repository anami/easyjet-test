// Dice characters are from: https://emojicombos.com/dice

function Die({ value } : {value: number }) {
    const diceChars = '⚀⚁⚂⚃⚄⚅'
    return <div>{diceChars.charAt(value - 1)}</div>
}

export function Craps() {
    


    function handleRoll() {

    }
    
    return (
        <>
            <h1>Craps</h1>
            <div className="dice">
                <div style={{
                    fontSize: '60px',
                    width: '100px',
                    height: '100px',
                    color: 'yellow',
                    display: 'flex'
                }}>
                    <Die value={2} />
                    <Die value={4} />
                </div>
            </div>
            <div>
                <button onClick={handleRoll}>Roll</button>
            </div>
        </>
    )

}