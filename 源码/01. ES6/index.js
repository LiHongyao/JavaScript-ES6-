/*
 * @Author: Li-HONGYAO
 * @Date: 2021-04-30 14:50:16
 * @LastEditTime: 2021-05-07 15:45:38
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \源码\01. ES6\index.js
 */

let api = {
  _appsecret: "5732e4c9db7ff9f7",
  appID: "wx1695393264bf7d",
  wx: "gh_133b3cd88m3a",
};

const RESTRICTED = ["_appsecret"];
api = new Proxy(api, {
  get(target, key, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      return undefined;
    }
    return Reflect.get(target, key, proxy);
  },
  set(target, key, value, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      throw Error(`${key} 为私有属性，不可赋值`);
    }
    return Reflect.set(target, key, value, proxy);
  },
});

console.log(api._appsecret); // Uncaught Error: _appsecret 为私有属性，不可访问
api._appsecret = "123"; // Uncaught Error: _appsecret 为私有属性，不可赋值
