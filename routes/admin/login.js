const router = require("koa-router")(),
  tools = require("../../model/tools"),
  DB = require("../../model/db.js");


router.get("/", async (ctx)=>{
  await ctx.render("admin/login")
})

router.post("/doLogin", async (ctx)=>{
  console.log(ctx.request.body);
  const data = ctx.request.body;
  // 数据库匹配
  let userName = data.username,
    password = data.password;
  // 验证输入是否合法
  // ..
  // 查询数据库
  const result =await DB.find("admin", {"name": userName, "password": tools.md5(password)})
  console.log("查询数据库---",result);
  if(result.length > 0) {
    ctx.session.userinfo = result[0];
    ctx.redirect(ctx.state.__HOST__ + "/admin")
  } else {
    await DB.insert("admin", {"name": userName, "password": tools.md5(password)})
  }
})
module.exports = router.routes();