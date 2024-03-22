/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

interface ErrorType {
  [key: string]: (val: string) => string;
}

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
})
export class FormErrorsComponent {
  @Input() public ctrl!: AbstractControl<any, any> | null;

  private ERROR_MESSAGES: ErrorType = {
    required: () => 'This field is required.',
    min: (val: any) => `> ${val.min}`,
    max: (val: any) => `< ${val.max}`,
  };

  public shouldShowErrors(): boolean {
    if (this.ctrl?.errors) {
      return this.ctrl?.errors && this.ctrl.touched;
    }
    return false;
  }

  public listOfErrors(): string[] {
    if (this.ctrl?.errors) {
      return Object.keys(this.ctrl.errors).map((key) => {
        if (this.ctrl) {
          return this.ERROR_MESSAGES[key](this.ctrl.getError(key));
        }
        return '';
      });
    }
    return [];
  }
}
