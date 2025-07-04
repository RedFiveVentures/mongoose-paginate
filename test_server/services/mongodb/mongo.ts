import mongoose, { Connection } from 'mongoose';

interface MongooseClientConfig {
    uri: string;
    options?: mongoose.ConnectOptions;
}

class MongooseClient {
    private static instance: MongooseClient;
    private connection: Connection | null = null;
    private isConnecting: boolean = false;
    private connectionPromise: Promise<Connection> | null = null;

    private constructor() {}

    public static getInstance(): MongooseClient {
        if (!MongooseClient.instance) {
            MongooseClient.instance = new MongooseClient();
        }
        return MongooseClient.instance;
    }

    public async connect(config: MongooseClientConfig): Promise<Connection> {
        if (this.connection?.readyState === 1) {
            return this.connection;
        }

        if (this.isConnecting && this.connectionPromise) {
            return this.connectionPromise;
        }

        this.isConnecting = true;

        const defaultOptions: mongoose.ConnectOptions = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            ...config.options
        };

        this.connectionPromise = this.establishConnection(config.uri, defaultOptions);

        try {
            this.connection = await this.connectionPromise;
            this.setupEventListeners();
            return this.connection;
        } finally {
            this.isConnecting = false;
        }
    }

    private async establishConnection(uri: string, options: mongoose.ConnectOptions): Promise<Connection> {
        try {
            await mongoose.connect(uri, options);
            console.log('MongoDB connected successfully');
            return mongoose.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    private setupEventListeners(): void {
        if (!this.connection) return;

        this.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        this.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            this.connection = null;
        });

        this.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            await mongoose.disconnect();
            this.connection = null;
            console.log('MongoDB connection closed');
        }
    }

    private async gracefulShutdown(): Promise<void> {
        console.log('Shutting down MongoDB connection...');
        await this.disconnect();
        process.exit(0);
    }

    public getConnection(): Connection | null {
        return this.connection;
    }

    public isConnected(): boolean {
        return this.connection?.readyState === 1;
    }

    public getMongoose(): typeof mongoose {
        return mongoose;
    }
}

// Export the singleton instance
export const mongooseClient = MongooseClient.getInstance();

// Export the class for type definitions
export { MongooseClient, MongooseClientConfig };