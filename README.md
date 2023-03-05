# notes

# 拆分后端模块
## origin
+ models（-> ./models）、
+ 路由（-> ./server.js）、
+ express应用（-> ./server.js）、
+ middlewares（-> ./server.js）
+ 程序入口（-> ./server.js）

> 程序入口文件 server.js   
    1. 连接数据库（在model/note里）   
    2. 建立一个 express 应用   
    3. 事件处理程序的路由   
    4. 加载 dotenv 的 config   
    5. 建立和使用 middlewares （morgan、cors、path 和 errorHandler）

## new: 
+ models（-> ./models）、
+ 路由（-> ./controllers/notes.js）、
+ express应用（-> ./app.js）、
+ middlewares（-> ./utils/*.js）
+ 程序入口（-> ./server.js）   

程序入口链式调用：server.js(0-> app, 1-> utils)  --0> app.js(0-> express app, 1-> connect db, 2-> routers, 3-> utils) --1> routers, middlewares
