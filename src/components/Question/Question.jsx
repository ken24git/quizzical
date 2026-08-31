import { nanoid } from "nanoid"
import { Fragment, useRef } from "react"
import { clsx } from "clsx"
import { decodeHtml } from "../../utils/helpers.js"
import "./Question.css"

export default function Question({ question, questionKey, incorrectAnswers, correctAnswer, answerArray, answerIds, quizFinished })
{
    // ref will store the selected answer
    const selectedAnswer = useRef()
    console.log(selectedAnswer.current)
    
    // click listener function updates the currently selected answer
    function selectAnswer(event) {
        // listens for clicks on the labels, since the inputs are invisible and unclickable
        selectedAnswer.current = event.target.getAttribute("for")
        console.log(selectedAnswer.current)
    }

    const answerElements = answerArray.map((answer, index) =>
    { 
        const isCorrect = answer === correctAnswer
        return (
            <Fragment key={nanoid()}>
                <input
                    type="radio" 
                    name={questionKey} 
                    id={answerIds[index]}
                    disabled={quizFinished}
                    className={clsx(
                        "answer-input",
                        isCorrect ? "correct" : "incorrect",
                        { "final-checked": selectedAnswer.current === answerIds[index] }
                    )}
                />
                <label 
                    className={clsx(
                        "answer-label",
                        quizFinished ? "finished" : null
                    )} 
                    htmlFor={answerIds[index]}
                    onClick={selectAnswer}
                >
                    {decodeHtml(answer)}
                </label>
            </Fragment>
        )
    })

    return (
        <article className="question">
            <p className="question-text">{decodeHtml(question)}</p>
            <div className="answer-container">
                {answerElements}
            </div>
        </article>
    )
}