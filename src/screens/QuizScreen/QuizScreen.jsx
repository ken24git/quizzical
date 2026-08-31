import { useState, useEffect, useRef } from 'react'
import Question from "../../components/Question/Question.jsx"
import { nanoid, random } from "nanoid"
import { randomizeArray } from "../../utils/helpers.js"
import "./QuizScreen.css"

export default function QuizScreen({ returnToMenu, quizSettings })
{
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [finished, setFinished] = useState(false)

    // function to fetch from trivia API
    async function fetchQuestions(fetchUrl)
    {
        try
        {
            const res = await fetch(fetchUrl)
            if (!res.ok)
            {
                throw new Error(`HTTP ${res.status}`);
            }
            if (res.headers.get("content-type") !== "application/json") 
            {
                throw new Error("Response was not JSON")
            }
            const data = await res.json()
            setQuestions(data.results.map(question =>
            {
                // id for the questions and answers, and array containing the answers is added here in order to maintain them constant after re-renders
                return {
                    ...question,

                    /*
                    the question key is set in the API call because the key needs to be static in order to stop the component from getting unmounted and mounted again(see below for explanation), allowing the code to correctly track which answer was selected
                    
                    obs: components, if given different props across renders, will be remounted, resetting values like ref and state. 
                    For example, a tag given the key of nanoid() will be remounted every single render, since the prop key is being declared dynamically. A solution is to set a hard coded value
                    */
                    "question_key": nanoid(),
                    "answer_array": randomizeArray([...question.incorrect_answers, question.correct_answer]),
                    "answer_ids": Array.from({ length: [...question.incorrect_answers, question.correct_answer].length }, () => nanoid())
                }
            }))

            // loading done
            setLoading(false)
        }
        catch (error)
        {
            console.log(error)

            // the API can only be accessed once every 5 seconds
            setTimeout(() => fetchQuestions(fetchUrl), 5500)
        }
    }

    const urlParams = new URLSearchParams({
        amount: quizSettings.amount
    })
    if (quizSettings.category_id !== "any") 
    {
        urlParams.set("category", quizSettings.category_id)
    }
    if (quizSettings.difficulty !== "any") 
    {
        urlParams.set("difficulty", quizSettings.difficulty)
    }
    if (quizSettings.type !== "any") 
    {
        urlParams.set("type", quizSettings.type)
    }

    // custom URL built to fetch questions according to the user's settings
    const customUrl = `https://opentdb.com/api.php?${urlParams.toString()}`

    // fetching the questions from the API
    useEffect(() =>
    {
        fetchQuestions(customUrl)
    }, []
    )

    // loading text
    if (loading)
    {
        return (
            <p>Loading...</p>
        )
    }

    // iterating through the API response data and creating a question component for each one
    const questionElements = questions.map(obj =>
    {
        return (
            <Question
                key={obj.question_key}
                question={obj.question}

                // the question key is used in the radio answers' name attribute
                questionKey={obj.question_key}

                incorrectAnswers={obj.incorrect_answers}
                correctAnswer={obj.correct_answer}
                answerArray={obj.answer_array}
                answerIds={obj.answer_ids}
                quizFinished={finished}
            />
        )
    })

    const correctAnswers = document.querySelectorAll("input.correct:checked").length

    return (
        <article className="quiz-screen">
            {questionElements}
            <div className="quiz-footer">
                {
                    finished &&
                    (
                        <span className="score-text">
                            You scored {correctAnswers}/{questions.length} correct answers.
                        </span>
                    )
                }
                {
                    finished &&
                    (
                        <button 
                            className="final-btn"
                            onClick={returnToMenu}
                        >
                            Return to menu
                        </button>
                    )
                }
                <button
                    className="final-btn"
                    onClick={finished ?
                        () =>
                        {
                            setFinished(false);
                            setLoading(true);
                            fetchQuestions(customUrl);
                        } :
                        () => (setFinished(true))
                    }
                >
                    {
                        finished ?
                            "Play again" :
                            "Check answers"
                    }
                </button>
            </div>
        </article>
    )
}