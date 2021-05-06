/*
 * @Author: Li-HONGYAO
 * @Date: 2021-04-30 14:50:16
 * @LastEditTime: 2021-05-06 18:10:32
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \01. ES6\index.js
 */

class Student {
  constructor(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }
  description() {
    console.log(`
        姓名：${this.name}
        年龄：${this.age}
        性别：${this.gender}
    `);
  }
}
// 创建类实例
let stu = new Student(`Petter`, `26`, `male`);
console.log(stu.hasOwnProperty(`name`)); // true
console.log(stu.hasOwnProperty(`age`)); // true
console.log(stu.hasOwnProperty(`gender`)); // true
console.log(stu.hasOwnProperty(`description`)); // false
console.log(stu.__proto__.hasOwnProperty(`description`)); // true
