import "./StartScreen.css"
import { useState, useEffect } from "react"
import { nanoid } from "nanoid"

export default function StartScreen({ startQuiz, setQuizSettings })
{
    const [categories, setCategories] = useState([])

    // fetching the category IDs and names from the open trivia db API
    async function fetchCategories()
    {
        try
        {
            const res = await fetch("https://opentdb.com/api_category.php")
            if (!res.ok)
            {
                throw new Error(`HTTP ${res.status}`)
            }
            const data = await res.json()
            setCategories(data.trivia_categories)
        }
        catch (error)
        {
            console.log(error)
            fetchCategories()
        }
    }
    useEffect(() =>
    {
        fetchCategories()
    }, [])

    // creates the option tags to choose category of questions
    const optionElements = categories.map(category =>
    {
        return (
            <option
                key={nanoid()}
                value={category.id}
            >
                {category.name}
            </option>
        )
    })

    // all of the valid category IDs
    const validIds = categories.map(category => category.id.toString())

    // validating user inputs
    function checkInputs()
    {
        const categoryId = document.getElementById("category").value
        const amount = Math.floor(document.getElementById("amount").value)
        const difficulty = document.querySelector("input[name='difficulty']:checked").value
        const type = document.querySelector("input[name='type']:checked").value

        if (![...validIds, "any"].includes(categoryId)) 
        {
            alert("Please select a category!")
            return
        }
        if (amount > 50 || amount < 1) 
        {
            alert("Please input a number between 1 and 50!")
            return
        }
        if (!["any", "easy", "medium", "hard"].includes(difficulty))
        {
            alert("Invalid difficulty value!")
            return
        }
        if (!["any", "multiple", "boolean"].includes(type))
        {
            alert("Invalid type value!")
            return
        }
        setQuizSettings(categoryId, amount, difficulty, type)
        startQuiz()
    }

    return (
        <article className="start-screen">
            <header>
                <h1>Quizzical</h1>
                <h2>Select the category and number of questions!</h2>
            </header>
            <section className="input-section">
                <div className="input-container">
                    <label className="input-main-label" htmlFor="category">Category</label>
                    <select className="input-field" name="category" id="category" defaultValue={"any"}>
                        <option value="any">Any category</option>
                        {optionElements}
                    </select>
                </div>
                <div className="input-container">
                    <label className="input-main-label" htmlFor="amount">Number of questions</label>
                    <input className="input-field" type="number" name="amount" id="amount" defaultValue="5" min="1" max="50" step="1" />
                </div>
                <fieldset className="input-container">
                    <legend className="input-main-label">Difficulty</legend>

                    <div className="input-radio">
                        <input name="difficulty" type="radio" value="any" id="any-diff" defaultChecked={true}></input>
                        <label htmlFor="any-diff">Any difficulty</label>
                    </div>
                    <div className="input-radio">
                        <input name="difficulty" type="radio" value="easy" id="easy"></input>
                        <label htmlFor="easy">Easy</label>
                    </div>
                    <div className="input-radio">
                        <input name="difficulty" type="radio" value="medium" id="medium"></input>
                        <label htmlFor="medium">Medium</label>
                    </div>
                    <div className="input-radio">
                        <input name="difficulty" type="radio" value="hard" id="hard"></input>
                        <label htmlFor="hard">Hard</label>
                    </div>
                </fieldset>
                <fieldset className="input-container">
                    <legend className="input-main-label">Type of question</legend>

                    <div className="input-radio">
                        <input type="radio" name="type" value="any" id="any-type" defaultChecked={true} />
                        <label htmlFor="any-type">Any type</label>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="type" value="multiple" id="multiple" />
                        <label htmlFor="multiple">Multiple choice</label>
                    </div>
                    <div className="input-radio">
                        <input type="radio" name="type" value="boolean" id="boolean" />
                        <label htmlFor="boolean">True / False</label>
                    </div>

                </fieldset>
            </section>
            <button className="start-quiz-btn" onClick={checkInputs}>Start quiz</button>
        </article>
    )
}