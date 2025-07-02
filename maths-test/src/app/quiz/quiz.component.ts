import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { QuizService, MathQuestion } from '../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  animations: [
    trigger('questionFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.97)' }),
        animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'none' })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)',
          style({ opacity: 0, transform: 'translateY(-20px) scale(0.97)' })
        )
      ])
    ])
  ]
})
export class QuizComponent implements OnInit {
  answerForm: FormGroup;
  currentQuestion: MathQuestion;
  currentIndex: number = 0;
  totalQuestions: number = 0;
  feedback: 'correct' | 'incorrect' | null = null;
  showFeedback = false;
  isLastQuestion = false;
  progress = 0;
  showConfetti = false;

  constructor(
    private quizService: QuizService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.answerForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuestion();
  }

  loadQuestion() {
    this.currentIndex = this.quizService.getCurrentIndex();
    this.totalQuestions = this.quizService.getTotalQuestions();
    this.currentQuestion = this.quizService.getCurrentQuestion();
    this.isLastQuestion = this.currentIndex === this.totalQuestions - 1;
    this.progress = Math.round((this.currentIndex / this.totalQuestions) * 100);
    this.answerForm.reset();
    this.showFeedback = false;
    this.feedback = null;
  }

  submitAnswer() {
    if (this.answerForm.valid) {
      const userAnswer = parseFloat(this.answerForm.value.answer);
      const isCorrect = this.quizService.submitAnswer(userAnswer);
      this.feedback = isCorrect ? 'correct' : 'incorrect';
      this.showFeedback = true;
      if (isCorrect) {
        this.showConfetti = true;
      }
      setTimeout(() => {
        this.showConfetti = false;
        if (this.quizService.isQuizComplete()) {
          this.router.navigate(['/results']);
        } else {
          this.loadQuestion();
        }
      }, 700);
    }
  }
}
