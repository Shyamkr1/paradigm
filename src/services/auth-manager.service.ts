import { EventEmitter } from 'events';
import { ZerodhaApiAuth, ZerodhaApiAuthConfig, ZerodhaApiSession } from '../auth/zerodha-api-auth';
import { logger } from '../logger/logger';

export class AuthManagerService extends EventEmitter {
    private static instance: AuthManagerService;
    private auth: ZerodhaApiAuth | null = null;
    private config: ZerodhaApiAuthConfig;
    private loginStatus: 'idle' | 'logging_in' | 'logged_in' | 'error' = 'idle';
    private lastError: string | null = null;

    private constructor() {
        super();
        this.config = {
            apiKey: process.env.ZERODHA_API_KEY || '',
            apiSecret: process.env.ZERODHA_API_SECRET || '',
            userId: process.env.ZERODHA_USER_ID || '',
            password: process.env.ZERODHA_PASSWORD || '',
            totpSecret: process.env.ZERODHA_TOTP_SECRET || '',
            redirectUri: process.env.ZERODHA_REDIRECT_URI || 'https://127.0.0.1'
        };
    }

    public static getInstance(): AuthManagerService {
        if (!AuthManagerService.instance) {
            AuthManagerService.instance = new AuthManagerService();
        }
        return AuthManagerService.instance;
    }

    public getStatus() {
        return {
            status: this.loginStatus,
            error: this.lastError,
            isAuthenticated: this.auth?.getSession() !== null
        };
    }

    public async initialize(): Promise<void> {
        try {
            this.loginStatus = 'logging_in';
            this.emit('status_change', this.getStatus());

            this.auth = new ZerodhaApiAuth(this.config);

            // Set up event listeners
            this.auth.on('session_loaded', (session) => {
                this.loginStatus = 'logged_in';
                this.lastError = null;
                this.emit('status_change', this.getStatus());
                this.emit('session_update', session);
            });

            this.auth.on('login_failed', (error) => {
                this.loginStatus = 'error';
                this.lastError = error.message;
                this.emit('status_change', this.getStatus());
            });

            await this.auth.initialize();

            this.loginStatus = 'logged_in';
            this.lastError = null;
            this.emit('status_change', this.getStatus());

        } catch (error: any) {
            this.loginStatus = 'error';
            this.lastError = error.message;
            this.emit('status_change', this.getStatus());
            throw error;
        }
    }

    public async makeAuthenticatedRequest(endpoint: string, method: 'GET' | 'POST' | 'DELETE' = 'GET', data?: any): Promise<any> {
        if (!this.auth) {
            throw new Error('Auth not initialized');
        }
        return this.auth.makeAuthenticatedRequest(endpoint, method, data);
    }

    public getSession(): ZerodhaApiSession | null {
        return this.auth?.getSession() || null;
    }
} 