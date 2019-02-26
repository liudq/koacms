const Koa = require("koa"),
  router = require("koa-router")(),
  render = require("koa-art-template"),
  path = require("path"),
  static = require("koa-static"),
  session = require("koa-session"),
  bodyParser = require('koa-bodyparser'),
  index = require("./routes/index"),
  admin = require("./routes/admin"),
  api = require("./routes/api"),
  caipiao = require("./routes/caipiao");


const app = new Koa();
app.use(bodyParser());

// 配置模版引擎
render(app, {
  root:path.join(__dirname, "views"),
  extname: ".html",
  debug: process.env.NODE_ENV !== "production"
})

// 配置session
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess', 
  maxAge: 864000,
  autoCommit: true, 
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: true,//每次请求都重新设置session
  renew: false,
};

app.use(session(CONFIG, app))
// 配置静态资源
app.use(static(__dirname + "/public"));

router.use(async (ctx, next)=>{
  // 获取根目录
  host = ctx.request.header.host;
  ctx.state.__HOST__ = "http://" + host;

  // 后台页面权限判断
  if(ctx.session.userinfo) {
    await next();
  } else {
    if(ctx.url == "/admin/login" || ctx.url == "/admin/login/doLogin" || ctx.url == "/caipiao") {
       await next();
    } else {
      ctx.redirect("/admin/login")
    }
   
  }
  
})

router.use(index);

router.use("/admin", admin);

router.use("/api", api);

router.use("/caipiao", caipiao);


app.use(router.routes()).use(router.allowedMethods())
app.listen(5000);