import { Admin } from "../models";
import { BcryptService } from "../services/bcrypt.service";

export const adminSeed = async()=>{
    const bcryptService = new BcryptService();
    const hashedPassword = await bcryptService.hashPassword("admin@12");
    const adminData = {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
    };
    const admin = await Admin.findOne({ email: adminData.email });
    if(!admin){
        const data = await Admin.create(adminData);
        console.log(data);
    }
    console.log("Admin has been seeded!!")
}