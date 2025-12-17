"use client";

import { useEffect } from "react";
import { useQuiz } from "../hooks/useQuiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, BrainCircuit, CheckCircle, XCircle, ArrowRight, Coins } from "lucide-react";

export function QuizManager() {
    const {
        quizzes, activeQuiz, currentQuestion, currentQuestionIndex,
        score, isFinished, loading,
        fetchQuizzes, startQuiz, submitAnswer, claimReward, resetGame
    } = useQuiz();

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    // ------------------------------------------------------------------
    // 1. RESULT SCREEN (จบเกม)
    // ------------------------------------------------------------------
    if (isFinished && activeQuiz) {
        const totalPoints = activeQuiz.questions.reduce((acc, q) => acc + q.points, 0);
        const percentage = Math.round((score / totalPoints) * 100);

        return (
            <Card className="w-full max-w-lg mx-auto bg-zinc-900 border-zinc-800 animate-in zoom-in duration-300">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-yellow-500/20 p-4 rounded-full w-fit mb-4">
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </div>
                    <CardTitle className="text-3xl text-white">Quiz Completed!</CardTitle>
                    <CardDescription>You have finished "{activeQuiz.title}"</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {score} <span className="text-xl text-zinc-500 font-medium">/ {totalPoints} pts</span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Accuracy</span>
                            <span>{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button variant="outline" onClick={resetGame} className="flex-1 border-zinc-700 text-zinc-300">
                        Close
                    </Button>
                    <Button onClick={claimReward} className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold">
                        <Coins className="w-4 h-4 mr-2" /> Claim Reward
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // ------------------------------------------------------------------
    // 2. GAME BOARD (กำลังเล่น)
    // ------------------------------------------------------------------
    if (activeQuiz && currentQuestion) {
        const progress = ((currentQuestionIndex) / activeQuiz.questions.length) * 100;

        return (
            <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center text-zinc-400 text-sm mb-2">
                    <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <Progress value={progress} className="h-1 bg-zinc-800" />

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader>
                        <Badge variant="outline" className="w-fit mb-2 border-zinc-700 text-zinc-400">{activeQuiz.title}</Badge>
                        <CardTitle className="text-2xl text-white leading-relaxed">
                            {currentQuestion.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {currentQuestion.choices.map((choice, index) => (
                            <Button
                                key={choice.id}
                                variant="outline"
                                className="h-auto py-4 px-6 justify-start text-left text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-all text-base"
                                onClick={() => submitAnswer(choice.id)}
                            >
                                <span className="bg-zinc-800 w-6 h-6 rounded flex items-center justify-center text-xs mr-3 text-zinc-500">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {choice.text}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // 3. QUIZ LIST (หน้าแรก)
    // ------------------------------------------------------------------
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-10">
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                    <BrainCircuit className="text-pink-500" />
                    Quiz Challenge
                </h2>
                <p className="text-zinc-400 text-sm">
                    Test your knowledge and earn real wallet credits!
                </p>
            </div>

            {loading ? (
                <div className="text-center text-zinc-500">Loading quizzes...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="bg-zinc-900/50 border-zinc-800 hover:border-pink-500/50 transition-all cursor-pointer group hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className={quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                        {quiz.difficulty}
                                    </Badge>
                                    <div className="flex items-center text-yellow-500 text-sm font-bold gap-1 bg-yellow-500/10 px-2 py-1 rounded">
                                        <Coins className="w-4 h-4" /> Win ฿{quiz.reward}
                                    </div>
                                </div>
                                <CardTitle className="text-xl text-zinc-100 group-hover:text-pink-400 transition-colors">
                                    {quiz.title}
                                </CardTitle>
                                <CardDescription className="text-zinc-400 line-clamp-2">
                                    {quiz.description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full bg-zinc-800 hover:bg-pink-600 hover:text-white transition-all text-zinc-300" onClick={() => startQuiz(quiz)}>
                                    Start Challenge <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}