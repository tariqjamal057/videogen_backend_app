import plans from "../data/plan.json"
import { Plan } from "../models";

export const planSeed = async()=>{
    for (const element of plans) {
        let plan = await Plan.findOne({ amount: element.amount });
        if(!plan){
            plan = await Plan.create(element);
        }else{
            await Plan.updateOne({ _id: plan._id }, element);
        }
    }
    console.log("Plan has been seeded!!")
}