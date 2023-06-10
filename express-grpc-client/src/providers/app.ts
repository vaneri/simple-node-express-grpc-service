import Log from "../middlewares/Log";
import Express from "./Express";

class App {

    // Clear the console
	public clearConsole (): void {
		process.stdout.write('\x1B[2J\x1B[0f');
	}

    public loadConfiguration(): void {
        // dotenv.config ({path: path.join(__dirname, '../../environment/.env-dev')});
    }

    // Loads your Server
    public loadServer(): void {
        Log.info('Server :: Booting @ Master...');

        Express.init();
    }

    // Loads the Worker Cluster
    public loadWorker(): void {
        Log.info('Worker :: Booting @ Master...');
    }

}

export default new App;
