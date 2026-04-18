import bcrypt from "bcryptjs";

export class BcryptService {
    private readonly SALT_ROUNDS: number;
    constructor() {
        this.SALT_ROUNDS = 12;
    }
    public async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
