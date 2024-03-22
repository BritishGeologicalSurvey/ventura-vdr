import { environment } from 'src/environments/environment.base';

import { Nutrient } from '../enums/nutrient.enum';
import { CompoundInformation } from '../interfaces/compound-information.interface';

export const CompoundList: CompoundInformation[] = [
  {
    id: Nutrient.NITROGEN,
    name: 'Nitrogen',
    units: environment.waterQualityUnits,
    description:
      'Nitrogen can occur in rivers and streams, lakes, and coastal waters in several forms including ammonia (NH3), nitrates (NO3) and nitrites (NO2).',
  },
  {
    id: Nutrient.PHOSPHORUS,
    name: 'Phosphorus',
    units: environment.waterQualityUnits,
    description: 'Phosphorus is a chemical element with the symbol P and atomic number 15',
  },
  {
    id: Nutrient.AMMONIA,
    name: 'Ammonia',
    units: environment.waterQualityUnits,
    description: 'Ammonia is a nutrient that contains nitrogen and hydrogen. Its chemical formula is NH3.',
  },
];
