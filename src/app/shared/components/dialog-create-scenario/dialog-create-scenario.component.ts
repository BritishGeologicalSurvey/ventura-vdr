import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-create-scenario',
  templateUrl: './dialog-create-scenario.component.html',
  styleUrls: ['./dialog-create-scenario.component.scss'],
})
export class DialogCreateScenarioComponent implements OnInit {
  public formVisible = true;
  public form!: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogCreateScenarioComponent>) {}

  public handleCancel(): void {
    this.dialogRef.close();
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      scenarioName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
}
