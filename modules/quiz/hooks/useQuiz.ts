import { useState, useCallback, useMemo } from "react";
import { QuizSet } from "../types";
import { QuizService } from "../services/quiz.service";
import { usePayment } from "@/modules/payment";
import { toast } from "sonner";

export function useQuiz() {
    const { topUp } = usePayment();

    const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
    const [activeQuiz, setActiveQuiz] = useState<QuizSet | null>(null);

    // Game State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load Quizzes
    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        const data = await QuizService.getQuizzes();
        setQuizzes(data);
        setLoading(false);
    }, []);

    // Start Game
    const startQuiz = (quiz: QuizSet) => {
        setActiveQuiz(quiz);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsFinished(false);
    };

    // ✅ คำนวณคำถามปัจจุบัน (แก้ Error ตรงนี้)
    const currentQuestion = useMemo(() => {
        if (!activeQuiz) return null;
        return activeQuiz.questions[currentQuestionIndex];
    }, [activeQuiz, currentQuestionIndex]);

    // Submit Answer
    const submitAnswer = (choiceId: string) => {
        if (!activeQuiz || !currentQuestion) return;

        const selectedChoice = currentQuestion.choices.find(c => c.id === choiceId);

        // ตรวจคำตอบ (ถ้าถูก บวกคะแนน)
        if (selectedChoice?.isCorrect) {
            setScore(prev => prev + currentQuestion.points);
            toast.success("Correct!", { duration: 1000 });
        } else {
            toast.error("Wrong answer!", { duration: 1000 });
        }

        // ไปข้อต่อไป หรือ จบเกม
        if (currentQuestionIndex < activeQuiz.questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 500); // Delay นิดนึงให้เห็นผล
        } else {
            setTimeout(() => setIsFinished(true), 500);
        }
    };

    // Claim Reward
    const claimReward = async () => {
        if (activeQuiz && score > 0) {
            const totalPoints = activeQuiz.questions.reduce((acc, q) => acc + q.points, 0);
            const rewardRatio = score / totalPoints;
            const rewardAmount = Math.floor(activeQuiz.reward * rewardRatio);

            if (rewardAmount > 0) {
                // ✅ แก้บรรทัดนี้: ส่งข้อความ Custom ไปบอกว่าเป็นรางวัลจาก Quiz
                await topUp(rewardAmount, `Reward: ${activeQuiz.title}`);

                toast.success(`You earned ฿${rewardAmount}!`);
                resetGame();
            } else {
                toast.info("Score too low for reward.");
                resetGame();
            }
        } else {
            resetGame();
        }
    };

    const resetGame = () => {
        setActiveQuiz(null);
        setIsFinished(false);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    return {
        quizzes,
        activeQuiz,
        currentQuestion, // ✅ ส่งออกไปให้ UI ใช้
        currentQuestionIndex,
        score,
        isFinished,
        loading,
        fetchQuizzes,
        startQuiz,
        submitAnswer,
        claimReward,
        resetGame
    };
}