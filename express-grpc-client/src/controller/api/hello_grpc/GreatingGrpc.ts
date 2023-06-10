
import { Request, Response } from "express";
import GreatingGRPCClient from "./GreatingGrpcClient";
import Log from "../../../middlewares/Log";

class GreatingsClient {
	private static client: GreatingGRPCClient = new GreatingGRPCClient();

	public static async index(request: Request, response: Response): Promise<Response> {
		try {
			Log.info(`request ${request.body}`);
			const resolve = await GreatingsClient.client.sayHello();
			Log.info(`got resolved ${resolve}`);
			return response.json({
				message: resolve.message
			});

		} catch (err) {
			return response.json({
				err: err
			});
		}
	}
}

export default GreatingsClient;
