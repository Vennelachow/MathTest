import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';

interface OperationOption {
  value: 'addition' | 'subtraction' | 'multiplication' | 'division';
  label: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  operationOptions: OperationOption[] = [
    { value: 'addition', label: 'Addition', icon: '➕', selected: false },
    { value: 'subtraction', label: 'Subtraction', icon: '➖', selected: false },
    { value: 'multiplication', label: 'Multiplication', icon: '✖️', selected: false },
    { value: 'division', label: 'Division', icon: '➗', selected: false }
  ];

  digitOptions = [1, 2, 3];
  selectedDigits = 1;

  questionOptions = [5, 10, 15, 20];
  selectedQuestions = 10;

  floatingNumbers: number[] = [];

  constructor(private quizService: QuizService, private router: Router) {
    this.generateFloatingNumbers();
  }

  toggleOperation(idx: number) {
    this.operationOptions[idx].selected = !this.operationOptions[idx].selected;
  }

  selectDigits(d: number) {
    this.selectedDigits = d;
    this.generateFloatingNumbers();
  }

  selectQuestions(q: number) {
    this.selectedQuestions = q;
    this.generateFloatingNumbers();
  }

  generateFloatingNumbers() {
    const min = Math.pow(10, this.selectedDigits - 1);
    const max = Math.pow(10, this.selectedDigits) - 1;
    const count = Math.min(this.selectedQuestions, 10);
    this.floatingNumbers = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }

  startTest() {
    const selectedOps = this.operationOptions.filter(op => op.selected).map(op => op.value);
    if (!selectedOps.length) return;
    this.quizService.setConfig(selectedOps, this.selectedQuestions, this.selectedDigits);
    this.router.navigate(['/quiz']);
  }

  get hasSelectedOperation() {
    return this.operationOptions.some(op => op.selected);
  }
}
