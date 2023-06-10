/**
 * Register your Express middlewares
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import { Application } from 'express';
import Http from './Http';



class Kernel {
	public static init (_express: Application): Application {

		// Mount basic express apis middleware
		_express = Http.mount(_express);

		return _express;
	}
}

export default Kernel;
