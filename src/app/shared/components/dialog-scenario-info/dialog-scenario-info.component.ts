import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface ScenarioInfoDialogData {
  id: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-dialog-scenario-info',
  templateUrl: './dialog-scenario-info.component.html',
  styleUrls: ['./dialog-scenario-info.component.scss'],
})
export class DialogScenarioInfoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: ScenarioInfoDialogData) {}

  public title!: string;
  public desc!: string;

  public ngOnInit() {
    this.title = this.dialogData.title;
    this.desc = this.dialogData.desc;
  }
}
