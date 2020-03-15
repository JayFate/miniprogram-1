// app.js
import { camelCase } from "lodash";

App({
  onLaunch: function() {
    console.log("-----------------------------------------------x");
    console.log(camelCase("OnLaunch"));
    console.log(
      `环境：${process.env.NODE_ENV} 构建类型：${process.env.BUILD_TYPE}`
    );
  },
  globalData: {}
});
