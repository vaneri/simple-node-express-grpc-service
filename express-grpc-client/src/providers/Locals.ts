
import { Application } from 'express';

interface ServerInfo {
	port: number;
	url: string;
}

class Locals {


	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static config(): ServerInfo {

		const url = process.env['APP_URL'] || `http://localhost:${process.env['PORT']}`;
		const port = 4040;

		return {
			port,
			url
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static init(_express: Application): Application {
		_express.locals['app'] = this.config();
		return _express;
	}
}

export default Locals;

