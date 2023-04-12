var express = require('express');
var router = express.Router();

const db = require('../db')

function zenkaku2Hankaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

/* GET home page. */
router.get('/',async function (req, res, next) {
  let activeRecipe = await db.getActiveRecipes()
  res.render('index', { title: 'Omeshi - dashboard',activeRecipe:activeRecipe });
});

router.get('/recipes',async (req,res)=>{
  let recipes = await db.listRecipe()
  recipes = recipes.map((v)=>{
    v.ingredients = v.ingredients.map(v=>v.name)
    v.ingredients = v.ingredients.toString()
    v.steps = v.steps.map(v=>v.type==='step'?v.text:'')
    v.steps = v.steps.toString()
    return v
  })
  console.log(recipes)
  res.render('recipes',{ title:'Omeshi - recipes',recipes:recipes})
})

router.get('/newRecipe', function (req, res, next) {
  res.render('newRecipe', { title: 'Omeshi - add new recipe' });
});

router.post('/newRecipe', function (req, res, next) {

  //
  // ingredients = [ { id,name,quantity,unit,group } ]
  // steps = [ { id,text,type,time,ext } ]
  //

  console.log(req.body)
  if (!req.body.title) {
    res.send({ err: 'missing title' })
    return
  }
  if (!req.body.ingredients) {
    res.send({ err: 'missing ingredients' })
    return
  }
  if (!req.body.steps) {
    res.send({ err: 'missing steps' })
    return
  }
  let hankakuIngredients = zenkaku2Hankaku(req.body.ingredients)
  let hankakuSteps = zenkaku2Hankaku(req.body.steps)
  let ingredientList = hankakuIngredients.split('\r\n')
  let stepList = hankakuSteps.split('\r\n')
  let ingredients = []
  let steps = []
  ingredients = ingredientList.map((v,i) => {
    v = v.split(' ')
    if (v.length === 3) {
      return { id:i,name: v[0], quantity: v[1], unit: v[2] }
    } else if (v.length === 4) {
      return { id:i,group: v[0], name: v[1], quantity: v[2], unit: v[3] }
    } else {
      return { id:i,name: v[0] }
    }
  })
  steps = stepList.map((v,i)=>{
  // steps = [ { id,text,type,time,ext } ]
    v = v+''
    if(v.startsWith('- ')){
      // console.log('a timer')
      v = v.replace('- ','')
      v = v.padStart(6,0)
      let timeHour = parseInt(v.slice(0,2))
      let timeMinut =  parseInt(v.slice(2,4))
      let timeSecond =  parseInt(v.slice(4,6))
      // console.log(timeHour+' ' + timeMinut+' '+timeSecond)
      let time = timeHour*3600 + timeMinut*60 + timeSecond
      // console.log(time)
      return {id:i,text:`计时器:${timeHour}:${timeMinut}:${timeSecond}`,type:'timer',time:time,ext:''}
    }else{
      return {id:i,text:v,type:'step',time:0,ext:''}
    }
  })

  console.log(ingredients)
  console.log(steps)
  db.newRecipe(req.body.title,ingredients,steps,req.body?.content)
  res.render('newRecipe', { title: 'Omeshi - add new recipe' });
});

router.post('/taberu',async (req,res)=>{
  if(!req.body.id){
    res.send({err:'missing id'})
    return
  }
  db.setRecipeActive(req.body.id)
  res.send({err:'',id:req.body.id})
})

router.post('/done',async (req,res)=>{
  if(!req.body.id){
    res.send({err:'missing id'})
    return
  }
  db.setRecipeInactive(req.body.id)
  res.send({err:'',id:req.body.id})
})

module.exports = router;
