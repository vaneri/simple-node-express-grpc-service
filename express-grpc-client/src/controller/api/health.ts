import { Request, Response } from "express";

class Health {
    public static index(_request: Request, response: Response): Response {
        return response.json({
            message: "alive"
        });
    }
}
export default Health;