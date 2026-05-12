export interface HealthPayload {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface HealthReadyPayload {
  status: string;
  database: string;
  timestamp: string;
}
