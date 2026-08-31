import { useState, useRef } from 'react'
import StartScreen from './screens/StartScreen/StartScreen.jsx'
import QuizScreen from "./screens/QuizScreen/QuizScreen.jsx"
import "./styles/App.css"
import "./styles/globals.css"

function App()
{ 
    const [quizStarted, setQuizStarted] = useState(false)
    const quizSettings = useRef({})

    function setQuizSettings(categoryId, amount, difficulty, type) {
        quizSettings.current = 
        {
            "category_id": categoryId,
            "amount": Math.floor(amount),
            "difficulty": difficulty,
            "type": type
        }
    }

    return (
        <main>
            {quizStarted ?
                <QuizScreen 
                    returnToMenu={() => (setQuizStarted(false))}
                    quizSettings={quizSettings.current}
                /> :
                <StartScreen 
                    startQuiz={() => (setQuizStarted(true))} 
                    setQuizSettings={setQuizSettings}
                />
            }
        </main>
    )
}

export default App
