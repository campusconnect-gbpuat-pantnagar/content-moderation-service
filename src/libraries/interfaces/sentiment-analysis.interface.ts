export interface SentimentScore {
  label: string;
  score: number;
}

export interface SafetyCheckResponse {
  isSafe: boolean;
  sentiments: SentimentScore[];
}
