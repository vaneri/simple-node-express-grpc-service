
import { Request, Response } from "express";
import Log from "../../middlewares/Log";

class Index {
	public static index(request:Request, response:Response): Response {
		Log.info(request.body);
		return response.json({
			message: "hello"
		});
	}
}

export default Index;
