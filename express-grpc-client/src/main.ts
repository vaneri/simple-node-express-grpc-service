import * as os from 'os';

import cluster from 'cluster';
import App from './providers/app.js';
import NativeEvent from './event/NativeEvent.js';

// this is extending the Request object globally
declare global {
    namespace Express {
        export interface Request {
            span?: any;
        }
    }
}

if (cluster.isPrimary) {
	/**
	 * Catches the process events
	 */
	NativeEvent.process();

	/**
	 * Clear the console before the app runs
	 */
	App.clearConsole();

	/**
	 * Load Configuration
	 */
	App.loadConfiguration();

	/**
	 * Find the number of available CPUS
	 */
	const CPUS: os.CpuInfo[] = os.cpus();

	/**
	 * Fork the process, the number of times we have CPUs available
	 */
	CPUS.forEach(() => cluster.fork());

	/**
	 * Catches the cluster events
	 */
	NativeEvent.cluster(cluster);

	/**
	 * Run the Worker every minute
	 * Note: we normally start worker after
	 * the entire app is loaded
	 */
	setTimeout(() => App.loadWorker(), 1000 * 60);

} else {

	/**
	 * Run the Server on Clusters
	 */
	App.loadServer();
}
