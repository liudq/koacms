const router = require("koa-router")(),
  login = require("./admin/login"),
  user = require("./admin/user");
router.get("/", async (ctx)=>{
  await ctx.render("admin/index")
})

router.use("/login", login);

router.use("/user", user);

module.exports = router.routes();