const Datastore = require('nedb-promises')
const shortid = require('shortid');
// let order = Datastore.create('./db/order.db')
let ingredients = Datastore.create('./db/ingredients.db')
let recipe = Datastore.create('./db/recipe.db')
let logs = Datastore.create('./db/logs.db')

const db = {
    // cleanDb() {
    //     ingredients.deleteMany({})
    //     recipe.deleteMany({})
    // },
    async newIngredients(name, unit = 'g', stock = 0) {
        if (!name) return { err: 'need a name' }
        let sameNameIng = await ingredients.findOne({ name: name })
        if (sameNameIng) {
            if (sameNameIng.unit === unit) {
                return ingredients.updateOne({
                    name: name
                }, {
                    $set: {
                        stock: sameNameIng.stock += stock
                    }
                })
            } else {
                return { err: 'find a diff unit item' }
            }
        } else {
            return await ingredients.insertOne({
                name: name,
                unit: unit,
                stock: stock,
                uuid: shortid.generate()
            })
        }
    },
    async listIngredients() {
        return await ingredients.find({})
    },

    async findIngredientsByUUID(uuid) {
        if (!uuid) return { err: 'need a uuid' }
        return await ingredients.findOne({
            uuid: uuid
        })
    },
    async findIngredientsByName(name) {
        if (!name) return { err: 'need a name' }
        return await ingredients.findOne({
            name: name
        })
    },
    async findIngredientsFuzzy(name) {
        if (!name) return { err: 'need a name' }
        return await ingredients.find({
            name: { $gte: name }
        })
    },
    async newRecipe(title,ingredients=[],steps=[],content='',gallery=[]){
        //
        // ingredients = [ { id,name,quantity,unit,group } ]
        // steps = [ { id,text,type,time,ext } ]
        // type: [ timer,step ]
        //
        if(!title) return {err:'need a title'}
        if(ingredients.length <= 0){
            return {err:'missing ingredients'}
        }
        if(steps.length <= 0){
            return {err:'missing steps'}
        }
        return await recipe.insertOne({
            version:0,
            uuid: shortid.generate(),
            title:title,
            ingredients:ingredients,
            steps:steps,
            content:content,
            gallery:gallery,
            active:false
        })
    },
    async mergeRecipe(title,ingredients=[],steps=[],content='',gallery=[]){
        
    },
    async listRecipe(){
        return await recipe.find({})
    },
    async findRecipeFuzzy(keyword){
        if(!keyword)return {err:'need a keyword'}
        let recipes = await recipe.find({
            $or:[
                {
                    title:{$gte:keyword}
                },
                {
                    "ingredients.name":{$gte:keyword}
                }
            ]
        })
        return recipes
    },
    async setRecipeActive(id){
        return await recipe.updateOne({_id:id},{$set:{active:true}})
    },
    async setRecipeInactive(id){
        return await recipe.updateOne({_id:id},{$set:{active:false}})
    },
    async getActiveRecipes(){
        return await recipe.find({active:true})
    },
    async consumeIngredients(uuid,cost,reason='',recipeId=''){
        if(!uuid) return {err:'need consume something'}
        if(!cost) return {err:'need cost'}
        
    }
}

;(async ()=>{
    // db.newRecipe('title',[
    //     {uuid:'hksxhCxLX',name:'123',cost:10},
    //     {uuid:'hksxhCxLX',name:'321',cost:20}
    // ],[
    //     {timer:0,text:'123123123123'},
    //     {timer:0,text:'123123123123'},
    //     {timer:0,text:'123123123123'},
    //     {timer:0,text:'123123123123'},
    //     {timer:0,text:'123123123123'},
    // ],'好吃不贵',[])
    // console.log(await db.findRecipeFuzzy('1'))
})()

module.exports = db