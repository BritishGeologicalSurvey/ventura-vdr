import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import {
  DialogLearnAboutItemComponent,
  MoreInformationDialogData,
} from 'src/app/shared/components/dialog-learn-about-item/dialog-learn-about-item.component';
import { StaticLayerVisualisationType } from 'src/app/shared/enums/static-layer-visualisation-type.enum';
import { TemporalLayerVisualisationType } from 'src/app/shared/enums/temporal-layer-visualisation-type.enum';
import { TemporalLayerVisualisationItem } from 'src/app/shared/interfaces/temporal-layer.interface';

import { MapService } from '../services/map.service';

export interface LegendConfig {
  swatchColour: string;
  text: string;
}

@Component({
  selector: 'app-layer-panel',
  templateUrl: './layer-panel.component.html',
  styleUrls: ['./layer-panel.component.scss'],
})
export class LayerPanelComponent {
  @Input() public leafletMap!: L.Map;
  @Output() public onStaticLayerChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private mapService: MapService,
    private dialog: MatDialog,
  ) {}

  public staticLayerList: StaticLayerItem[] = [
    {
      type: StaticLayerVisualisationType.SUBCATCHMENTS,
      name: 'Subcatchments',
      description:
        'The Upper Mersey catchment covers around 1,000 km2 and comprises 44 subcatchments. Catchments are defined as an area of land from which all surface run-off flows through a series of streams, rivers and, possibly, lakes to a particular point in the water course such as a river confluence. ',
    },
    {
      type: StaticLayerVisualisationType.RIVERS,
      name: 'Rivers',
      description:
        'Water flow refers to the volume of water that is moving through a particular point or section of a river, stream, or other waterway.',
    },
    {
      type: StaticLayerVisualisationType.LPAS,
      name: 'LPAs',
      description: 'Office for National Statistics Local Planning Authorities (April 2022) UK BUC',
    },
    {
      type: StaticLayerVisualisationType.WWTP,
      name: 'WWTP',
      description: 'Waste water treatment plant locations.',
    },
  ];

  public referenceLayerList: ReferenceLayerItem[] = [
    {
      type: TemporalLayerVisualisationType.POPULATION,
      name: 'Population',
      description: 'Population',
    },
    {
      type: TemporalLayerVisualisationType.GREEN_SPACE,
      name: 'Green Space',
      description: 'Green space',
    },
    {
      type: TemporalLayerVisualisationType.PROP_IMPERV,
      name: 'Impervious Area',
      description: 'Proportion impervious in overall subcatchment',
    },
  ];
  public legendList: LegendConfig[] = [];
  public legendPopulation: LegendConfig[] = [
    {
      swatchColour: '#fff7f3',
      text: '<= 1700',
    },
    {
      swatchColour: '#fde0dd',
      text: '<= 4600',
    },
    {
      swatchColour: '#fcc5c0',
      text: '<= 10000',
    },
    {
      swatchColour: '#fa9fb5',
      text: '<= 17000',
    },
    {
      swatchColour: '#f768a1',
      text: '<= 29000',
    },
    {
      swatchColour: '#dd3497',
      text: '<= 60000',
    },
    {
      swatchColour: '#ae017e',
      text: '<= 107000',
    },
    {
      swatchColour: '#7a0177',
      text: '<= 163000',
    },
  ];

  public legendPI: LegendConfig[] = [
    {
      swatchColour: '#ffffcc',
      text: '<= 0.2',
    },
    {
      swatchColour: '#ffeda0',
      text: '<= 0.3',
    },
    {
      swatchColour: '#fed976',
      text: '<= 0.4',
    },
    {
      swatchColour: '#feb24c',
      text: '<= 0.5',
    },
    {
      swatchColour: '#fd8d3c',
      text: '<= 0.6',
    },
    {
      swatchColour: '#fc4e2a',
      text: '<= 0.7',
    },
    {
      swatchColour: '#e31a1c',
      text: '<= 0.8',
    },
    {
      swatchColour: '#b10026',
      text: '<= 0.9',
    },
  ];

  public legendGreenSpace: LegendConfig[] = [
    {
      swatchColour: '#ffffe5',
      text: '<= 0.2',
    },
    {
      swatchColour: '#f7fcb9',
      text: '<= 0.3',
    },
    {
      swatchColour: '#d9f0a3',
      text: '<= 0.4',
    },
    {
      swatchColour: '#addd8e',
      text: '<= 0.5',
    },
    {
      swatchColour: '#78c679',
      text: '<= 0.6',
    },
    {
      swatchColour: '#41ab5d',
      text: '<= 0.7',
    },
    {
      swatchColour: '#238443',
      text: '<= 0.8',
    },
    {
      swatchColour: '#005a32',
      text: '<= 0.9',
    },
  ];

  public onReferenceChange(event: MatChipSelectionChange) {
    const visualisationItem: TemporalLayerVisualisationItem = {
      visualisation: event.source.value,
      display: event.selected,
    };
    if (event.selected === false) {
      this.legendList = [];
    } else {
      switch (event.source.value) {
        case TemporalLayerVisualisationType.POPULATION:
          this.legendList = this.legendPopulation;
          break;
        case TemporalLayerVisualisationType.PROP_IMPERV:
          this.legendList = this.legendPI;
          break;
        case TemporalLayerVisualisationType.GREEN_SPACE:
          this.legendList = this.legendGreenSpace;
          break;
        default:
          this.legendList = [];
          break;
      }
    }
    this.mapService.updateTemporalLayerVisualisation(visualisationItem);
  }

  public onStaticChange(event: MatChipSelectionChange) {
    if (event.isUserInput) {
      this.onStaticLayerChange.emit(event.source.value);
    }
  }

  public openLearnAboutItemDialog(): void {
    const moreInfoContent: MoreInformationDialogData = {
      title: 'Reference Layers',
      subheading: '',
      content: ['More information about the different reference layers which are available to view.'],
    };

    const config = {
      data: moreInfoContent,
      maxWidth: '20vw',
    };
    this.dialog.open(DialogLearnAboutItemComponent, config);
  }
}

export interface StaticLayerItem {
  type: StaticLayerVisualisationType;
  name: string;
  description: string;
}

export interface ReferenceLayerItem {
  type: TemporalLayerVisualisationType;
  name: string;
  description: string;
}
