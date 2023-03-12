import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { distinctUntilChanged, filter, map } from 'rxjs';
import sha1 from 'sha1';

import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    input: new FormControl('', { nonNullable: true }),
    garbage: new FormControl('G@R8A6E', { nonNullable: true }),
    fullHash: new FormControl('', { nonNullable: true }),
    resultingHash: new FormControl('', { nonNullable: true }),
    hashLength: new FormControl(8, { nonNullable: true }),
  });

  constructor(public localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.form.controls.hashLength.addValidators([Validators.min(1), Validators.max(40)]);

    this.form.valueChanges
      .pipe(
        map(() => {
          const { input, garbage } = this.form.getRawValue();
          return { input, garbage };
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(({ input, garbage }) => {
        this.form.controls.fullHash.setValue(sha1(input + garbage));
      });

    this.form.valueChanges
      .pipe(
        map(() => {
          const { hashLength, fullHash } = this.form.getRawValue();
          return { hashLength, fullHash };
        }),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(({ hashLength, fullHash }) => {
        this.form.controls.resultingHash.setValue(fullHash.substring(fullHash.length - hashLength));
      });

    this.startStorageSync();
  }

  startStorageSync() {
    this.form.controls.hashLength.setValue(this.localStorageService.getItem('hashLength'));

    this.form.controls.hashLength.valueChanges
      .pipe(filter(() => this.form.controls.hashLength.valid))
      .subscribe((value) => {
        this.localStorageService.setItem('hashLength', value);
      });
  }
}
