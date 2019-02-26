const router = require("koa-router")();


router.get("/", async (ctx)=>{
 await ctx.render("caipiao/index")
})

module.exports = router.routes();