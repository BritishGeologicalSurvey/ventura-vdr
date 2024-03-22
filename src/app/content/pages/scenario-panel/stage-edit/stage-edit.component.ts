import {
  Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { ScenarioService } from 'src/app/core/services/scenario.service';
import {
  DialogLearnAboutItemComponent,
  MoreInformationDialogData,
} from 'src/app/shared/components/dialog-learn-about-item/dialog-learn-about-item.component';
import { EditTableSource, NewScenario, ScenarioEditStage } from 'src/app/shared/models/scenario.model';

interface ValidationType {
  [key: string]: {
    min?: number;
    max?: number;
    step?: number;
    active?: boolean;
  };
}

@Component({
  selector: 'app-stage-edit',
  templateUrl: './stage-edit.component.html',
  styleUrls: ['./stage-edit.component.scss'],
})
export class StageEditComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private scenarioService: ScenarioService, private dialog: MatDialog) {}

  @Input() public noOfCatchments = 0;
  @Output() public editComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public editCancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  public editForm!: FormGroup;
  public currentStage!: string;
  public newDevelopmentsSource: Array<EditTableSource> = [];
  public newDevelopmentsCols: Array<string> = [];
  public subcatchmentCharacteristicsSource: Array<EditTableSource> = [];
  public subcatchmentCharacteristicsCols: Array<string> = [];
  public retrofitSource: Array<EditTableSource> = [];
  public retrofitCols: Array<string> = [];
  private newScenario!: NewScenario;
  private groupEdits: Array<ScenarioEditStage> | undefined = [];

  public validation: ValidationType = {
    rcForNewDevelopment: {
      min: 0.01,
      max: 0.99,
      step: 0.01,
    },
    waterDemandForNewDevelopment: {
      min: 50,
      max: 1000,
      step: 1,
    },
    overallAreaForNewDevelopment: {
      min: 0,
      max: 999999999999999,
      step: 1,
    },
    retrofitRC: {
      min: 0.01,
      max: 0.99,
      step: 0.01,
    },
    toggleRetrofitRC: {
      active: false,
    },
    retrofitPropertiesAppliedTo: {
      min: 0,
      max: 1,
      step: 0.01,
    },
    retrofitWaterDemand: {
      min: 50,
      max: 1000,
      step: 1,
    },
  };

  public ngOnInit(): void {
    this.initWatchers();
    this.initForm();
    this.initTables();
  }

  private initWatchers(): void {
    combineLatest([this.scenarioService.newScenarioObservable, this.scenarioService.shouldResetGroupsObs]).subscribe(
      ([newScenario, shouldReset]) => {
        this.newScenario = newScenario;
        if (this.newScenario.editArray) {
          this.groupEdits = newScenario.editArray;
        }

        if (shouldReset) {
          this.groupEdits = [];
        }
      },
    );
    this.scenarioService.currentStageObservable.subscribe((currentStage: string) => {
      this.currentStage = currentStage;
    });
  }

  private initForm(): void {
    this.editForm = this.formBuilder.group({
      rcForNewDevelopment: [0.5, [Validators.min(0.01), Validators.max(0.99)]],
      attenuationVol: [{ value: 0.02, disabled: true }, []],
      waterDemandForNewDevelopment: [150, [Validators.min(50), Validators.max(1000)]],
      overallAreaForNewDevelopment: [0, []],
      retrofitRC: [0.3, [Validators.min(0.01), Validators.max(0.99)]],
      toggleRetrofitRC: [false, []],
      retrofitPropertiesAppliedTo: [0, [Validators.min(0), Validators.max(1)]],
      retrofitWaterDemand: [100, [Validators.min(50), Validators.max(1000)]],
    });
  }

  private initTables(): void {
    this.newDevelopmentsSource = [
      {
        id: 'rcForNewDevelopment',
        name: 'Proportion of impervious inside new developments (0-1)',
        currentVal: 0.9,
        newVal: this.editForm.get('rcForNewDevelopment')?.value,
      },
      {
        id: 'waterDemandForNewDevelopment',
        name: 'Water demand for new development (L/pp/day)',
        currentVal: 150,
        newVal: this.editForm.get('waterDemandForNewDevelopment')?.value,
      },
      {
        id: 'overallAreaForNewDevelopment',
        name: 'New Development Area (m2)',
        currentVal: 0,
        newVal: this.editForm.get('overallAreaForNewDevelopment')?.value,
      },
    ];
    this.newDevelopmentsCols = ['id', 'name', 'newVal'];

    this.subcatchmentCharacteristicsSource = [
      {
        id: 'retrofitRC',
        name: 'Proportion impervious in overall subcatchment (0-1)',
        currentVal: 0.9,
        newVal: this.editForm.get('retrofitRC')?.value,
      },
      {
        id: 'toggleRetrofitRC',
        name: 'Enable RC formula calculation',
        currentVal: false,
        newVal: this.editForm.get('toggleRetrofitRC')?.value,
      },
    ];
    this.subcatchmentCharacteristicsCols = ['id', 'name', 'newVal'];

    this.retrofitSource = [
      {
        id: 'retrofitPropertiesAppliedTo',
        name: 'Proportion of properties applied to (0-1)',
        currentVal: 0,
        newVal: this.editForm.get('retrofitPropertiesAppliedTo')?.value,
      },
      {
        id: 'retrofitWaterDemand',
        name: 'Water demand (L/pp/day)',
        currentVal: 100,
        newVal: this.editForm.get('retrofitWaterDemand')?.value,
      },
    ];
    this.retrofitCols = ['id', 'name', 'newVal'];
  }

  public cancelNewScenario(): void {
    this.editCancel.emit(true);
  }

  public handleReview(): void {
    if (this.groupEdits) {
      this.groupEdits.push(this.editForm.value);
      this.scenarioService
        .cacheNewScenarioInArray({
          ...Object.assign(this.newScenario, {
            editArray: this.groupEdits,
          }),
        })
        .subscribe(() => {
          this.editComplete.emit(true);
          this.scenarioService.setShouldResetGroups(false);
        });
    }
  }

  public openLearnAboutItemDialog(showNewDevelopmentContent: boolean): void {
    const newDevelopmentContent: MoreInformationDialogData = {
      title: 'New development',
      subheading: '',
      boldContent: 'New development',
      content: [
        'Means development resulting from the conversion of previously undeveloped land or agricultural land uses.',
      ],
    };

    const newDevelopmentConfig = {
      data: newDevelopmentContent,
      maxWidth: '20vw',
    };

    const retroFitContent: MoreInformationDialogData = {
      title: 'Retrofit',
      subheading: '',
      boldContent: 'Retrofit',
      content: [
        'Is the sustainable refurbishment of an existing building to make it more efficient, better for the environment and sustainable for the future.',
      ],
    };

    const retroFitConfig = {
      data: retroFitContent,
      maxWidth: '20vw',
    };
    this.dialog.open(DialogLearnAboutItemComponent, showNewDevelopmentContent ? newDevelopmentConfig : retroFitConfig);
  }
}
