import {useRef, useState } from 'react'

export function FizzBuzz() {
    const inputRef1 = useRef<HTMLInputElement>(null)
    const inputRef2 = useRef<HTMLInputElement>(null)
    const [result, setResult] = useState('')

    function fizzbuzz(low: number, high: number) : string {
        let result = ''

        for(let i=low; i<= high; i++) {
            if (i % 3 === 0 && i%5 === 0){
                result += 'FizzBuzz\n'
            } else if (i % 3 === 0) {
                result += 'Fizz\n'
            } else if (i % 5 === 0) {
                result += 'Buzz\n'
            } else {
                result += `${i}\n`
            }
        }
        return result
    }

    function handleGoClick() {
        console.log(inputRef1.current?.value)

        if (inputRef1.current && inputRef2.current) {

            setResult(fizzbuzz(
                Number.parseInt(inputRef1.current.value), 
                Number.parseInt(inputRef2.current.value)))
        }
    }

    return (
        <>
            <h1>FizzBuzz</h1>
            <fieldset>
                <label htmlFor="number">Enter a number range: </label>
                <input id="number" ref={inputRef1} type="number" min="1" max="20000"></input>
                <input id="number" ref={inputRef2} type="number" min="1" max="20000"></input>
                <button onClick={handleGoClick}>Go</button>
            </fieldset>
            <textarea value={result} rows={50} >
            </textarea> 
        </>
    )

}