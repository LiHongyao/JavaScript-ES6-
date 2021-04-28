# 一、概念

\1. async/await是es8的规范，async 后面一般跟一个函数，也就是async一般跟在function前。

\2. await必须放在aysnc里面的函数体范围内。

\3. 在async修饰的函数里面，一定会返回一个promise对象，如果你没返回一个promise对象的话，默认会返回一个值为undefined的promise对象

\4. await后面如果是同步执行代码，那么会等待其执行完成，如果是异步代码则只有返回一个primise对象时，才会进行等待。

异步函数的工作方式是这样的：

```js
async function myFirstAsyncFunction() {
    try {
        const fulfilledValue = await promise;
    }
    catch (rejectedValue) {
        // …
    }
}
```

如果在函数定义之前使用了 `async` 关键字，就可以在函数内使用 `await`。 当您 `await` 某个 Promise 时，函数暂停执行，直至该 Promise 产生结果，并且暂停并不会阻塞主线程。 如果 Promise 执行，则会返回值。 如果 Promise 拒绝，则会抛出拒绝的值。

# 二、示例：记录获取日志

假设我们想获取某个网址并以文本形式记录响应日志。以下是利用 Promise 编写的代码：

```js
function logFetch(url) {
    return fetch(url)
    .then(response => response.text())
    .then(text => {
        console.log(text);
    })
    .catch(err => {
        console.error(err);
    })
}
```

以下是利用异步函数具有相同作用的代码：

```js
async function logFetch(url) {
    try {
        const response = await fetch(url);
        console.log(await response.text());
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}
```

代码行数虽然相同，但去掉了所有回调。这可以提高代码的可读性，对不太熟悉 Promise 的人而言，帮助就更大了。

# 三、异步函数返回值

无论是否使用 `await`，异步函数都会返回 Promise。该 Promise 解析时返回异步函数返回的任何值，拒绝时返回异步函数抛出的任何值。

# 四、其他异步函数语法

我们已经见识了 `async function() {}`，但 `async` 关键字还可用于其他函数语法：

## 1. 箭头函数

```js
// map some URLs to json-promises
const jsonPromises = urls.map(async url => {
    const response = await fetch(url);
    return response.json();
});
```

> 提示：`array.map(func)` 不在乎我提供给它的是不是异步函数，只把它当作一个返回 Promise 的函数来看待。 它不会等到第一个函数执行完毕就会调用第二个函数。

## 2. 对象方法

```js
const storage = {
    async getAvatar(name) {
        const cache = await caches.open('avatars');
        return cache.match(`/avatars/${name}.jpg`);
    }
};
storage.getAvatar('muzili').then(/* ... */);
```

## 3. 类方法

```js
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }

    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}

const storage = new Storage();
storage.getAvatar('jaffathecake').then(/* ... */);
```

> 提示：类构造函数以及 getter/settings 方法不能是异步的。

# 五、浏览器支持与解决方法

Chrome 55 中默认情况下启用异步函数，但它们在所有主流浏览器中正处于开发阶段：

## 1. 解决方法 - 生成器

如果目标是支持生成器的浏览器（其中包括[每一个主流浏览器的最新版本](http://kangax.github.io/compat-table/es6/#test-generators)），可以通过 polyfill 使用异步函数。

[Babel](https://babeljs.io/) 可以为您实现此目的，[以下是通过 Babel REPL 实现的示例](https://goo.gl/0Cg1Sq)

注意到转译的代码有多相似了吧。这一转换是 [Babel es2017 预设](http://babeljs.io/docs/plugins/preset-es2017/)的一部分。

我建议采用转译方法，因为目标浏览器支持异步函数后，直接将其关闭即可，但如果*实在*不想使用转译器，可以亲自试用一下 [Babel 的 polyfill](https://gist.github.com/jakearchibald/edbc78f73f7df4f7f3182b3c7e522d25)。

原本的异步函数代码：

```js
async function slowEcho(val) {
    await wait(1000);
    return val;
}
```

如果使用 [polyfill](https://gist.github.com/jakearchibald/edbc78f73f7df4f7f3182b3c7e522d25)，就需要这样编写：

```js
const slowEcho = createAsyncFunction(function* (val) {
    yield wait(1000);
    return val;
});
```

请注意，需要将生成器 (`function*`) 传递给 `createAsyncFunction`，并使用 `yield` 来替代 `await`。 其他方面的工作方式是相同的。

## 2. 解决方法 - 再生器

如果目标是旧版浏览器，Babel 还可转译生成器，让您能在版本低至 IE8 的浏览器上使用异步函数。 为此，您需要 [Babel 的 es2017 预设](http://babeljs.io/docs/plugins/preset-es2017/)*和* [es2015 预设](http://babeljs.io/docs/plugins/preset-es2015/)。

[输出不够美观](https://goo.gl/jlXboV)，因此要注意避免发生代码膨胀。

# 六、实例

\1. async 返回一个promise 对象

```js
async function test(flag) {
	if(flag) {
		return "hello";
  } else {
		throw "err";
  }
}
console.log(test(true));  // Promise {<resolved>: "hello"}
console.log(test(false)); // Promise {<rejected>: "err"}
```

\2. async 异步执行 

```js
async function test() {
    return "hello";
}
test().then(data => {
	console.log(data);
});
console.log("虽然在后面，但是我先执行");
// 虽然在后面，但是我先执行
// hello
```

\3. 如果await后是同步，会等待

\4. 如果await后是异步，并且返回的是 Promise，会等待

```js
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}
async function testResult() {
    let result = await doubleAfter2seconds(30);
    console.log(result);
}
testResult();
// 2s后输出60
```

