# 一、概述

JavaScript 是单线程工作，这意味着两段脚本不能同时运行，而是必须一个接一个地运行。Promise是异步编程的一种解决方案，比传统的解决方案 **回调函数和事件** 更合理、更强大。

**# 状态**

- pending：进行中
- resolved：成功
- rejected：失败

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数（回调地狱）。

**# 缺陷**

- 无法取消
- 如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。
- 当处于`Pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

**# 浏览器兼容**

现在，promise 已在各浏览器中实现。

自 Chrome 32、Opera 19、Firefox 29、Safari 8 和 Microsoft Edge 起，promise 默认启用。

如要使没有完全实现 promise 的浏览器符合规范，或向其他浏览器和 Node.js 中添加 promise，请查看 [polyfill](https://github.com/jakearchibald/ES6-Promises#readme)。

# 二、用法

语法形式：

```js
const promise = new Promise((resolve, reject) => {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。

```js
promise.then(() => {
  // success
}, error => {
  // fail
});
```

then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。

**eg：XMLHttpRequest 执行 Promise**

```js
function get(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.send();
        xhr.addEventListener("load", () => {
            if(xhr.status === 200) {
                resolve(xhr.response);
            }else {
                reject(Error(xhr.statusText));
            }
        });
        xhr.addEventListener("error", () => {
            reject(Error("network err!"));
        });
    })
}
```

现在让我们来使用这一功能：

```js
get("./data.json").then(data => {
    console.log(data)
}, err => {
    console.log(err);
});
```

# 三、链接

`then()` 不是最终部分，您可以将各个 `then` 链接在一起来改变值，或依次运行额外的异步操作。

## 1. 改变值

只需返回新值即可改变值：

```js
let promise = new Promise((resolve, reject) => {
    resolve(1);
});

promise.then(val => val + 1).then(val => {
    console.log(val); // 2
});
```

举一个实际的例子，上文中我们封装的 `get` 函数返回的是一个JSON，那我们需要对其进行JSON解析的处理，如下所示：

```js
get("./data.json").then(response => {
    return JSON.parse(response);
}).then(result => {
    console.log(result);
});
```

由于 `JSON.parse()` 采用单一参数并返回改变的值，因此我们可以将其简化为：

```js
get("./data.json").then(JSON.parse).then(result => {
    console.log("result:", result);
})
```

## 2. 异步操作队列

您还可以链接多个 `then`，以便按顺序运行异步操作。

```js
function t1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("t1");
            resolve("t1成功后返回的内容！");
        }, 1500);
    })
}
function t2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("t2");
            resolve("t2成功后返回的内容！");
        }, 500);
    })
}
function t3() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("t3");
            resolve("t3成功后返回的内容！");
        }, 1000);
    })
}

// 连续调用
t1().then(data => {
    console.log(data);
    return t2();
}).then(data => {
    console.log(data);
    return t3();
}).then(data => {
    console.log(data);
})
/* 
t1
t1成功后返回的内容！
t2
t2成功后返回的内容！
t3
t3成功后返回的内容！ */
```

# 四、错误处理

`then()` 包含两个参数：一个用于成功，一个用于失败：

```js
promise.then(() => {
  // success
}, error => {
  // fail
});
```

当然我们也可以使用 `catch()`：

```js
promise.then(() => {
    // success
}).catch(err => {
    console.log(err);
});
```

# 五、Promise.all()

`Promise.all` 包含一组 promise，并创建一个在所有内容成功完成后执行的 promise。 您将获得一组结果（即一组 promise 执行的结果），其顺序与您与传入 promise 的顺序相同。

```js
Promise.all(arrayOfPromises).then(arrayOfResults => {
  //...
})
```

示例：

```js
//通过all方法调用 注意 这个方式是并行执行的 无法决定顺序
Promise.all([t1(), t3(), t3()]).then(function (results) {
    console.log(results);
});
```



















