import categories from "../data/category.json"
import { Category, Template } from "../models"

export const categoryAndTemplateSeed = async()=>{
    for (const element of categories) {
        let category = await Category.findOne({ name: element.name });
        if(!category){
            category = await Category.create({
                name: element.name,
            });
        }
        for (const template of element.templates) {
            const tempData = await Template.findOne({ name: template.name });
            if(!tempData){
                await Template.create({...template, categoryId: category._id});
            }else{
                await Template.updateOne({
                    _id: tempData._id
                }, { $set: template })
            }
        }
    }
    console.log("Category and template has been seeded!!")
}