interface Descriptions {
  [key: string]: Record<string, string>;
}

export const descriptions: Descriptions = {
  businessAsUsual: {
    id: 'business-as-usual',
    title: 'Business as usual',
    desc: `
    This scenario assumes no additional measures/proposals are undertaken in any sub catchment. The land characteristics and water demand remain unchanged. Population increase across Manchester is assumed to be 30% in the long term and rainfall is to increase by 50%.
    `,
  },
  scenarioA: {
    id: 'scenario-a',
    title: 'Urban retrofit',
    desc: `
    This scenario assumes that central areas of Manchester have improvements made to their public space and housing with the introduction of SUDS and other methods to reduce runoff. This would have an effect of reducing the percentage of impervious area from 50% in average to 20%. In parallel to this improvement, 80% buildings are retrofitted to reduce their water consumption, which comes down to  the per capita demand of 100 litres per person per day, from a typical value of 143 nowadays.
    `,
  },
  scenarioB: {
    id: 'scenario-b',
    title: 'Increased urbanisation',
    desc: `
    This scenario assumes an increase of 20,000 people across central areas of Manchester spread across 5 sub-catchments. This scenario assumes a total of 500,000m2 of Gross Floor Area development with a density of 25m2 per person.
    `,
  },
  scenarioC: {
    id: 'scenario-c',
    title: 'Combined urban retrofit and increased urbanisation',
    desc: `
      Combination of Urban retrofit and increased urbanisation scenarios.
    `,
  },
};
