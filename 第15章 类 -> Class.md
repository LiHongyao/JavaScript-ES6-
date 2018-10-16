# # Class 基本语法

## 01. 概述

JavaScript 生成对象传统方法是通过构造函数实现，如下所示：

```javascript
function Person(name, age) {
	this.name = name;
	this.age  = age;
}
Person.prototype.description = function() {
	return `name: ${this.name} age: ${this.age}`
}
let per = new Person(`Henrry Lee`, 26);
```

上面这种写法跟传统的面向对象语言差异很大，很容易让新学习这门语言的程序员感到困惑。ES6提供了更接近传统语言的写法，引入了Class（类）这个概念，作为对象的模板。通过 `class` 关键字，可以定义类。基本上，ES6  `class` 的绝大部分功能，ES5都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用ES6的 “类” 改写如下所示：

```javascript
class Person {
    // 构造方法
	constructor(name, age) {
		this.name = name;
		this.age  = age;
	}
	description() {
		return `name: ${this.name} age: ${this.age}`
	}
}
let per = new Person(`Henrry Lee`, 25);
```

上面代码定义了一个“类”，可以看到里面有一个`constructor` 方法，这就是构造方法，而 `this` 关键字则代表实例对象。也就是说，ES5的构造函数 `Person`，对应ES6的 `Person` 类的构造方法。

`Person` 类除了构造方法，还定义了一个`description`方法。注意，定义“类”的方法的时候，前面不需要加上`function`这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

ES6的类，完全可以看作构造函数的另一种写法。

```javascript
class Person {
  // ...
}

console.log(typeof Person) // "function"
console.log(Person === Person.prototype.constructor) // true
```

上面代码表明，类的数据类型就是函数，类本身就指向构造函数。

使用的时候，也是直接对类使用`new`命令，跟构造函数的用法完全一致。

构造函数的 prototype 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 prototype 属性上面。

## 02. constructor

constructor 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的constructor 方法会被默认添加。				

```javascript
class Object {
    
}
// 等同于
class Object {
    constructor() {}
}
```

> 提示：
>
> 1. constructor 方法默认返回实例对象(即 `this` )，当然也可以通过 `return` 返回其他对象。
> 2. 创建对象实例时，必须加上 `new` 关键字。

## 03. 类的实例对象

```javascript
class Student {
    constructor(name, age, gender) {
        this.name   = name;
        this.age    = age;
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
```

> 注意：
>
> \> 实例的属性除非显式定义在其本身(即定义在 this 对象上)，否则都是定义在原型上(即定义在 class 上)	

与 ES5 一样，类的所有实例共享一个原型对象。

```javascript
let stu1 = new Student();
let stu2 = new Student();
console.log(stu1.__proto__ === stu2.__proto__); // true
```

这也意味着，可以通过实例的 __proto__ 属性为“类”添加方法。

```javascript
stu1.__proto__.sayHello = () => {
    console.log(`Hello, Girl!`);
};
stu2.sayHello();
```

> 注意：
>
> \> 使用实例的 __proto__ 属性改写原型，必须相当谨慎，不推荐使用，因为这会改变“类”的原始定义，影响到所有实例。

## 04. class 表达式

class 语序使用表达式定义：

```javascript
let myClass = class meClass {
    getClassName() {
        return meClass.name;
    }
};
```

上述类名为 `myClass`，`meClass` 只能在类内部使用.

通过 class 表达式，可以写出立即执行的class

```javascript
let dog = new class {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}('小黄');
dog.sayName(); // "小黄"
```

## 05. 不存在变量提升

类不存在变量提升，这意味着创建类的实例时时，必须先定义类。

## 06. 私有方法、属性

类不存在私有方法和私有属性，为了加以辨识，通常会在方法或属性前加下划线 `_`，但尽管如此，外部依然可以访问。

## 07. this 指向

类的方法内部如果含有 this ，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Person {
    sayHello(name = `Admin`) {
        this.printf(name);
    }
    printf(str) {
        console.log(`Hello, ${str}`);
    }
}
let per = new Person();
per.sayHello(`Tom`);

let { sayHello } = per; 
sayHello(`Jay`); // TypeError: Cannot read property 'printf' of undefined
```

要解决这个问题，主要有两种弄方案：

**方案1：在构造方法中动态绑定this**

```javascript
class Person {
    constructor() {
        // 动态绑定this
        this.sayHello = this.sayHello.bind(this);
    }
    // ...
}
```

**方案2：使用箭头函数**

```javascript
class Person {
    constructor() {
        // 动态绑定this
        this.sayHello = (name = `Admin`) => {
            this.printf(name);
        };
    }
    // ...
}
```

## 08. name 属性

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继承，包括 name 属性。

```javascript
class Point {}
Point.name // "Point"
```

name 属性总是返回紧跟在 class 关键字后面的类名。

## 09. setter & getter

与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class Person {
    constructor(){}
    get name() {
        console.log(`call the get.`);
        return `Admin`;
    }
    set name(value) {
        console.log(`call the set.`);
    }
}
let per = new Person();
// set
per.name = `Admin`;
// get
console.log(`name: ${per.name}`);
/*
call the set.
call the get.
name: Admin
*/
```

上面代码中，`name` 属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

## 10. 静态方法（类方法）

不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。静态方法声明需在方法前通过 `static` 关键字修饰。

```javascript
class Person {
    constructor(){}
    // static 修饰 -> 静态方法
    static sayHello() {
        console.log(`Hello`);
    }
    drinkWith(str) {
        console.log(`喝${str}!`);
    }
}

let per = new Person();

// 静态方法通过类名直接调用
per.sayHello();    // TypeError: per.sayHello is not a function
Person.sayHello(); // Hello
per.drinkWith(`龙井茶`);
```

> 注意：
>
> 1. 如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例。

## 11. 类的静态属性和实例属性

静态属性指的是 Class 本身的属性，即 *Class.propName* ，而不是定义在实例对象（`this`）上的属性。

```javascript
class Person {}
Person.flag = `true`;
console.log(Person.flag); // true
```

上面写法定义了一个 Person 类，并定义了一个静态属性 `flag`

# # Class 继承

## 01. extends

ES6 继承可通过 `extends` 关键字实现。

```javascript
// 定义Person类
class Person {
    constructor(name, age, gender){
        this.name   = name;
        this.age    = age;
        this.gender = gender;
    }
    // 静态方法
    static sayHello() {
        console.log(`Hello.`);
    }
    // 实例方法
    play(){
        console.log(`Play game.`)
    }
}

// 定义Student类继承于Person
class Student extends Person {
    constructor(name, age, gender, major) {
       // 调用父类构造方法初始化父类实例属性
        super(name, age, gender);
        this.major = major;
    }
    // 重写父类方法
    play() {
        // 在子类中调用父类方法
        super.play();
        console.log(`Play basketball.`)
    }
    description() {
        console.log(`
            姓名：${this.name}
            年龄：${this.age}
            性别：${this.gender}
            主修：${this.major}
        `);
    }
}

let stu = new Student(`木子李`, `26`, `男`, `软件工程`);
stu.description();
// 调用从父类继承的父类方法
stu.play();
```

## 02. Object.getPropertyOf()

该方法可以用来从子类上获取父类。

```javascript
console.log(Object.getPrototypeOf(Student) === Person); // true
```

因此，可以使用这个方法判断，一个类是否继承了另一个类。

## 03. super 关键字

super 关键字指向父类，可作为函数调用，也可作为对象调用。

当super作为函数调用时，调用父类的构造方法。

当super作为对象调用时，可通过super关键字调用父类的属性和方法。












​			


​			
​		
​	


​				
​			
​		
​	


​				
​			
​		
​	























​			
​		
​	

