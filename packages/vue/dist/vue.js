var Vue = (function (exports) {
    'use strict';

    var targetMap = new WeakMap();
    var activeEffect;
    function track(target, key) {
        console.log('收集依赖');
        if (!activeEffect)
            return;
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        depsMap.set(key, activeEffect);
        console.log(targetMap);
    }
    function trigger(target, key, vlaue) {
        var depsMap = targetMap.get(target);
        if (!depsMap)
            return; //没收集过
        var effect = depsMap.get(key); //暂时一个
        if (!effect)
            return;
        effect.fn();
    }
    function effect(fn) {
        var _effect = new ReactiveEffect(fn);
        _effect.run(); //完成第一次执行
    }
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn) {
            this.fn = fn;
        }
        ReactiveEffect.prototype.run = function () {
            activeEffect = this;
            this.fn();
        };
        return ReactiveEffect;
    }());

    var get = createGetter();
    var set = createSetter();
    var mutableHandlers = {
        get: get,
        set: set
    };
    function createGetter() {
        return function get(target, key, rececier) {
            var res = Reflect.get(target, key, rececier);
            track(target, key);
            return res;
        };
    }
    function createSetter() {
        return function set(target, key, value, rececier) {
            var result = Reflect.set(target, key, value, rececier);
            trigger(target, key);
            return result;
        };
    }

    var reactiveMap = new WeakMap(); //cache
    function reactive(target) {
        return createReactiveObject(target, mutableHandlers, reactiveMap);
    }
    function createReactiveObject(target, baseHandlers, proxyMap) {
        var existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        var proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy);
        return proxy;
    }

    exports.effect = effect;
    exports.reactive = reactive;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
