import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  score: number = 0;
  total: number = 0;

  constructor(
    private quizService: QuizService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.score = this.quizService.getScore();
    this.total = this.quizService.getTotalQuestions();
    this.openDialog();
  }

  openDialog(): void {
    const percent = (this.score / this.total) * 100;
    let message = '';
    if (percent >= 80) {
      message = "Excellent job! You're a math wizard!";
    } else if (percent >= 50) {
      message = 'Good effort! Keep practicing to improve.';
    } else {
      message = 'You can do better! Try again!';
    }
    this.dialog.open(ResultDialogComponent, {
      data: { message },
      disableClose: true
    });
  }

  restartTest(): void {
    this.quizService.reset();
    this.router.navigate(['/']);
  }
}
