/*
 * @Author: Li-HONGYAO
 * @Date: 2021-04-30 14:50:16
 * @LastEditTime: 2021-04-30 18:11:39
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \源码\01. ES6\index.js
 */


const getName = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Muzili');
  }, 1000);
})

const getJob = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('前端工程师');
  }, 1000);
})

;(async () => {
  console.log('程序执行')
  const name = await getName();
  const job  = await getJob();
  console.log(`${name} - ${job}`);
})(); 