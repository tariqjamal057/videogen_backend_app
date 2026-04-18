import jwt from "jsonwebtoken";
import { Config } from "../config";

export class JWTService {
    public async generateToken(payload: Record<string, string>): Promise<string> {
        const token = jwt.sign(payload, Config.JWT_SECRET, {
            expiresIn: "7d",
          });
          console.log(token);
        return token;
    }
}
