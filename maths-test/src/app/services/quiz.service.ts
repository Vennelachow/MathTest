import { Injectable } from '@angular/core';

export interface MathQuestion {
  operand1: number;
  operand2: number;
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private testTypes: ('addition' | 'subtraction' | 'multiplication' | 'division')[] = ['addition'];
  private digitCount = 1;
  private questionCount = 10;
  private questions: MathQuestion[] = [];
  private currentQuestionIndex = 0;
  private score = 0;

  setConfig(types: ('addition' | 'subtraction' | 'multiplication' | 'division')[], count: number, digits: number) {
    this.testTypes = types;
    this.questionCount = count;
    this.digitCount = digits;
    this.generateQuestions();
    this.currentQuestionIndex = 0;
    this.score = 0;
  }

  private generateQuestions() {
    const generated = new Set<string>();
    this.questions = [];
    const min = Math.pow(10, this.digitCount - 1);
    const max = Math.pow(10, this.digitCount) - 1;
    while (this.questions.length < this.questionCount) {
      const opType = this.testTypes[Math.floor(Math.random() * this.testTypes.length)];
      let operand1 = this.randomInt(min, max);
      let operand2 = this.randomInt(min, max);
      if (opType === 'division') {
        operand2 = this.randomInt(1, 12); // keep division simple
        operand1 = operand2 * this.randomInt(1, 12); // ensure divisible
      }
      const key = `${operand1}-${operand2}-${opType}`;
      if (!generated.has(key)) {
        generated.add(key);
        const answer = this.calculateAnswer(operand1, operand2, opType);
        this.questions.push({ operand1, operand2, operation: opType, answer });
      }
    }
  }

  private calculateAnswer(op1: number, op2: number, type: string): number {
    switch (type) {
      case 'addition': return op1 + op2;
      case 'subtraction': return op1 - op2;
      case 'multiplication': return op1 * op2;
      case 'division': return op1 / op2;
      default: return 0;
    }
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getQuestions(): MathQuestion[] {
    return this.questions;
  }

  getCurrentQuestion(): MathQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  getCurrentIndex(): number {
    return this.currentQuestionIndex;
  }

  getTotalQuestions(): number {
    return this.questionCount;
  }

  submitAnswer(answer: number): boolean {
    const q = this.questions[this.currentQuestionIndex];
    q.userAnswer = answer;
    q.isCorrect = Math.abs(q.answer - answer) < 1e-6;
    if (q.isCorrect) this.score++;
    this.currentQuestionIndex++;
    return q.isCorrect;
  }

  isQuizComplete(): boolean {
    return this.currentQuestionIndex >= this.questionCount;
  }

  getScore(): number {
    return this.score;
  }

  reset() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
  }
}
