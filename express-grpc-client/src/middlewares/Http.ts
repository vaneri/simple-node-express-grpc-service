
import * as express from 'express';
import * as bodyParser from 'body-parser';
import Log from './Log';
import session from 'express-session';
import compression from 'compression';

class Http {
	public static mount(_express: express.Application): express.Application {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: 400000
		}));

		_express.use(bodyParser.urlencoded({
			limit: 400000,
			parameterLimit: 10,
			extended: false
		}));

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');

		/**
		 * Enables the session store
		 *
		 * Note: You can also add redis-store
		 * into the options object.
		 */
		const options = {
			resave: true,
			saveUninitialized: true,
			secret: "secret",
			cookie: {
				maxAge: 1209600000 // two weeks (in ms)
			}
		};

		_express.use(session(options));

		// Enables the "gzip" / "deflate" compression for response
		_express.use(compression());

		return _express;
	}
}

export default Http;
