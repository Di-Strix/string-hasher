import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-readonly-field',
  templateUrl: './readonly-field.component.html',
  styleUrls: ['./readonly-field.component.scss'],
})
export class ReadonlyFieldComponent {
  @Input() label: string = '';
  @Input() value: string = '';

  constructor(public snackbar: MatSnackBar) {}

  copy() {
    navigator.clipboard.writeText(this.value);
    this.snackbar.open('Скопировано!', 'закрыть', { verticalPosition: 'top', duration: 5000 });
  }
}
