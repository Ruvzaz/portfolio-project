import { QuizSet } from "../types";

const MOCK_QUIZZES: QuizSet[] = [
    {
        id: "quiz-001",
        title: "Web Dev 101",
        description: "Basic HTML & CSS knowledge check.",
        reward: 500,
        difficulty: "Easy",
        questions: [
            {
                id: "q1",
                text: "What does HTML stand for?",
                points: 10,
                choices: [
                    { id: "c1", text: "Hyper Text Markup Language", isCorrect: true },
                    { id: "c2", text: "High Tech Modern Language", isCorrect: false },
                    { id: "c3", text: "Hyperlink and Text Markup", isCorrect: false },
                    { id: "c4", text: "Home Tool Markup Language", isCorrect: false },
                ]
            },
            {
                id: "q2",
                text: "Which tag is used for the largest heading?",
                points: 10,
                choices: [
                    { id: "c1", text: "<head>", isCorrect: false },
                    { id: "c2", text: "<h6>", isCorrect: false },
                    { id: "c3", text: "<h1>", isCorrect: true },
                    { id: "c4", text: "<header>", isCorrect: false },
                ]
            },
            {
                id: "q3",
                text: "What is the correct HTML element for inserting a line break?",
                points: 10,
                choices: [
                    { id: "c1", text: "<break>", isCorrect: false },
                    { id: "c2", text: "<br>", isCorrect: true },
                    { id: "c3", text: "<lb>", isCorrect: false },
                    { id: "c4", text: "<newline>", isCorrect: false },
                ]
            }
        ]
    },
    {
        id: "quiz-002",
        title: "React Master",
        description: "Advanced React concepts & Hooks.",
        reward: 2000,
        difficulty: "Hard",
        questions: [
            {
                id: "q1",
                text: "Which hook is used for side effects?",
                points: 50,
                choices: [
                    { id: "c1", text: "useState", isCorrect: false },
                    { id: "c2", text: "useEffect", isCorrect: true },
                    { id: "c3", text: "useContext", isCorrect: false },
                    { id: "c4", text: "useReducer", isCorrect: false },
                ]
            },
            {
                id: "q2",
                text: "What is the virtual DOM?",
                points: 50,
                choices: [
                    { id: "c1", text: "A direct copy of the real DOM", isCorrect: false },
                    { id: "c2", text: "A lightweight copy of the DOM", isCorrect: true },
                    { id: "c3", text: "A database for React", isCorrect: false },
                    { id: "c4", text: "A browser extension", isCorrect: false },
                ]
            }
        ]
    }
];

export const QuizService = {
    async getQuizzes(): Promise<QuizSet[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_QUIZZES;
    }
};