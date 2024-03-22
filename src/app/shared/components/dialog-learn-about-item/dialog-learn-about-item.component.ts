import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MoreInformationDialogData {
  title: string;
  subheading: string;
  content: Array<string>;
  boldContent?: string;
}

@Component({
  selector: 'app-dialog-create-scenario',
  templateUrl: './dialog-learn-about-item.component.html',
  styleUrls: ['./dialog-learn-about-item.component.scss'],
})
export class DialogLearnAboutItemComponent implements OnInit {
  public dialogContents: MoreInformationDialogData = {
    title: '',
    subheading: '',
    content: [],
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public inputDialogData: MoreInformationDialogData,
    public dialogRef: MatDialogRef<DialogLearnAboutItemComponent>,
  ) {}

  public ngOnInit(): void {
    this.dialogContents = this.inputDialogData;
  }

  public handleClose(): void {
    this.dialogRef.close();
  }
}
