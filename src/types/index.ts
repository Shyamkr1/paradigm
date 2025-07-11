// Common types and interfaces for the trading bot

export interface TickData {
  instrumentToken: number;
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface CandleData {
  instrumentToken: number;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: Date;
}

export interface TradeSignal {
  id: string;
  strategy: string;
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  quantity: number;
  price: number;
  stopLoss?: number;
  target?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TradeOrder {
  id: string;
  signalId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  stopLoss?: number;
  target?: number;
  status: 'PENDING' | 'COMPLETE' | 'CANCELLED' | 'REJECTED';
  orderId?: string; // Zerodha order ID
  executionPrice?: number;
  orderTime: Date;
  executionTime?: Date;
}

export interface Position {
  id: string;
  sessionId: string;
  instrumentId: string;
  instrument: Instrument;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number | null;
  side: 'LONG' | 'SHORT';
  stopLoss: number | null;
  target: number | null;
  trailingStop: boolean;
  unrealizedPnL: number | null;
  realizedPnL: number | null;
  openTime: Date;
  closeTime: Date | null;
}

export interface StrategyConfig {
  name: string;
  enabled: boolean;
  description?: string;
  parameters: Record<string, any>;
  capitalAllocation: number;
  instruments: string[];
}

export interface RiskConfig {
  maxDailyLoss: number;
  maxPositionSize: number;
  maxOpenPositions: number;
  defaultStopLossPercentage: number;
  trailingStopLoss: boolean;
  maxRiskPerTrade: number;
  maxPortfolioRisk: number;
}

export interface TradingConfig {
  mode: 'paper' | 'live' | 'backtest';
  capital: number;
  maxDailyLoss: number;
  maxPositionSize: number;
  maxOpenPositions: number;
}

export interface MarketDataConfig {
  websocketUrl: string;
  historicalDays: number;
  instruments: InstrumentConfig[];
}

export interface InstrumentConfig {
  symbol: string;
  exchange: string;
  instrumentType: string;
  lotSize?: number;
  tickSize?: number;
}

export interface ScheduleConfig {
  startTime: string;
  endTime: string;
  timezone: string;
  preMarketStart: string;
  postMarketEnd: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  filePath: string;
  maxFileSize: string;
  maxFiles: number;
}

export interface DatabaseConfig {
  url: string;
  poolSize: number;
  timeout: number;
}

export interface DashboardConfig {
  enabled: boolean;
  port: number;
  corsOrigin: string;
}

export interface BotConfig {
  trading: TradingConfig;
  marketData: MarketDataConfig;
  risk: RiskConfig;
  schedule: ScheduleConfig;
  strategies: Record<string, StrategyConfig>;
  logging: LoggingConfig;
  database: DatabaseConfig;
  dashboard: DashboardConfig;
}

export interface ZerodhaCredentials {
  apiKey: string;
  apiSecret: string;
  requestToken: string;
  accessToken?: string;
}

export interface ZerodhaInstrument {
  instrument_token: number;
  tradingsymbol: string;
  name: string;
  exchange: string;
  instrument_type: string;
  lot_size: number;
  tick_size: number;
}

export interface ZerodhaOrder {
  order_id: string;
  tradingsymbol: string;
  exchange: string;
  transaction_type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  status: 'OPEN' | 'COMPLETE' | 'CANCELLED' | 'REJECTED';
  order_timestamp: Date;
  exchange_timestamp?: Date;
}

export interface ZerodhaPosition {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
}

export interface SystemLog {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'AUTH' | 'MARKET_DATA' | 'STRATEGY' | 'ORDER' | 'POSITION' | 'RISK';
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
}

export interface TradingSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  mode: 'paper' | 'live' | 'backtest';
  capital: number;
  status: 'active' | 'completed' | 'stopped';
}

export type EventType =
  | 'tick_received'
  | 'signal_generated'
  | 'order_placed'
  | 'order_executed'
  | 'position_opened'
  | 'position_closed'
  | 'risk_check_passed'
  | 'risk_check_failed'
  | 'error_occurred';

export interface BotEvent {
  type: EventType;
  data: any;
  timestamp: Date;
}

export interface StrategyResult {
  success: boolean;
  signals: TradeSignal[];
  error?: string;
}

export interface RiskCheckResult {
  approved: boolean;
  reason?: string;
  modifiedSignal?: TradeSignal;
}

export interface OrderResult {
  success: boolean;
  order?: TradeOrder;
  error?: string;
}

export interface PositionResult {
  success: boolean;
  position?: Position;
  error?: string;
}

// Risk Management Types
export interface RiskProfile {
  id: string;
  userId: string;
  maxDailyLoss: number;
  maxDrawdown: number;
  maxPositionSize: number;
  riskPerTrade: number;
  maxOpenTrades: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  var: number;
  sharpeRatio: number;
}

export interface RiskMetrics {
  id: string;
  sessionId: string;
  date: Date;
  dailyPnL: number;
  drawdown: number;
  currentRisk: number;
  var: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
}

// Alert System Types
export type AlertType = 'PRICE' | 'VOLUME' | 'TECHNICAL_INDICATOR' | 'PNL' | 'RISK';
export type AlertCondition = 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW' | 'EQUALS';
export type NotificationMethod = 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface Alert {
  id: string;
  userId: string;
  instrumentId?: string;
  type: AlertType;
  condition: AlertCondition;
  value: number;
  currentValue?: number;
  message?: string;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  notifications: AlertNotification[];
}

export interface AlertNotification {
  id: string;
  alertId: string;
  method: NotificationMethod;
  destination: string;
  status: NotificationStatus;
  sentAt?: Date;
  createdAt: Date;
}

// Backtesting Types
export interface BacktestResult {
  id: string;
  strategyId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualReturn: number;
  maxDrawdown: number;
  sharpeRatio?: number;
  sortinoRatio?: number;
  calmarRatio?: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  createdAt: Date;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  id: string;
  backtestId: string;
  instrumentId: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl?: number;
  entryTime: Date;
  exitTime?: Date;
  holdingPeriod?: number;
}

// Transaction Cost Types
export interface TransactionCost {
  id: string;
  tradeId: string;
  brokerage: number;
  stt: number;
  exchangeFee: number;
  gst: number;
  stampDuty: number;
  sebiTurnover: number;
  totalCost: number;
  costPercentage: number;
}

export interface BrokeragePlan {
  id: string;
  brokerName: string;
  planName: string;
  equityDelivery: number;
  equityIntraday: number;
  equityFutures: number;
  equityOptions: number;
  currencyFutures: number;
  currencyOptions: number;
  commodityFutures: number;
  commodityOptions: number;
  dpCharges: number;
  isActive: boolean;
  createdAt: Date;
}

// API Monitoring Types
export interface ApiUsage {
  id: string;
  userId: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestCount: number;
  errorCount: number;
  avgResponseTime?: number;
  date: Date;
  hour: number;
}

export interface ApiQuota {
  id: string;
  userId: string;
  endpoint: string;
  dailyLimit: number;
  currentUsage: number;
  resetTime: Date;
  isExceeded: boolean;
}

export interface ApiError {
  id: string;
  userId: string;
  endpoint: string;
  errorCode: string;
  errorMessage: string;
  requestData?: any;
  responseData?: any;
  timestamp: Date;
}

export interface Trade {
  id: string;
  sessionId: string;
  instrumentId: string;
  instrument: Instrument;
  strategyId: string | null;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  orderType: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
  orderId: string | null;
  status: 'PENDING' | 'COMPLETE' | 'CANCELLED' | 'REJECTED';
  stopLoss: number | null;
  target: number | null;
  trailingStop: boolean;
  orderTime: Date;
  executionTime: Date | null;
  realizedPnL: number | null;
  unrealizedPnL: number | null;
}

export interface MarketData {
  id: string;
  instrumentId: string;
  instrument: Instrument;
  symbol: string;
  timestamp: Date;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  ltp: number | null;
  change: number | null;
  changePercent: number | null;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  instrumentType: string;
  lotSize: number;
  tickSize: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 