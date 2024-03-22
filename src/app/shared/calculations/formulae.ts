import { assumedArea, populationIncreasedWithNewDevelopment } from './constants';

/**
 * Calculates new per capita demand to send to API.
 *
 * @param {number} waterDemand
 * @param {number} retrofitPropertiesAppliedTo
 * @param {number} retrofitWaterDemand
 * @param {number} population
 * @param {number} overallAreaForNewDevelopment
 * @param {number} nearTermD
 * @param {number} waterDemandForNewDevelopment
 * @returns {number}
 */
export const calculateNewDemand = (
  retrofitPropertiesAppliedTo: number,
  retrofitWaterDemand: number,
  population: number,
  overallAreaForNewDevelopment: number,
  waterDemandForNewDevelopment: number,
  waterDemand = 110,
  nearOrFarTerm = 0,
): number => {
  const formula = ((waterDemand * (1 - retrofitPropertiesAppliedTo) + retrofitPropertiesAppliedTo * retrofitWaterDemand)
      * population
      + (overallAreaForNewDevelopment / assumedArea + nearOrFarTerm) * waterDemandForNewDevelopment)
    / (population + (overallAreaForNewDevelopment / assumedArea + nearOrFarTerm))
    / 1000;
  return formula;
};

/**
 * Calculates runoff coefficient value to send to API.
 *
 * @param {number} retrofitRc
 * @param {number} overallAreaForNewDevelopment
 * @param {number} nearTermD
 * @param {number} rcForNewDevelopment
 * @param {number} catchmentArea
 * @returns {number}
 */
export const calculateRcToChange = (
  retrofitRc: number,
  overallAreaForNewDevelopment: number,
  rcForNewDevelopment: number,
  catchmentArea: number,
  nearOrFarTerm = 0,
): number => {
  const formula = retrofitRc + (
    (overallAreaForNewDevelopment + nearOrFarTerm * assumedArea) * rcForNewDevelopment
  ) / catchmentArea;
  return formula;
};

export const calculatePopulationChange = (
  population: number,
  overallAreaForNewDevelopment: number,
  popIncreaseNewDev = populationIncreasedWithNewDevelopment, // hard coded value provided by Ed in email 30/08/23
): number => {
  const formula = (population + overallAreaForNewDevelopment / popIncreaseNewDev) / population;
  return formula;
};
