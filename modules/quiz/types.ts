export interface Choice {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    text: string;
    choices: Choice[];
    points: number;
}

export interface QuizSet {
    id: string;
    title: string;
    description: string;
    reward: number; // เงินรางวัลรวม
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: Question[];
}