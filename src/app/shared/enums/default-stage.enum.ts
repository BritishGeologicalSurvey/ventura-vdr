import { ResultComparisonType } from './comparison-type.enum';
import { DisplayValueOption } from './display-type.enum';
import { ResultType } from './result-type.enum';

export interface ResultsComparisonItem {
  comparisonType: ResultComparisonType;
  display: boolean;
}

export interface ComparisonItem {
  type: ResultComparisonType;
  summary: string;
  description: string;
}

export interface ModelResultsItem {
  type: ResultType;
  summary: string;
  description: string;
}

export interface DisplayValueItem {
  type: DisplayValueOption;
  summary: string;
  description: string;
  default: boolean;
}
