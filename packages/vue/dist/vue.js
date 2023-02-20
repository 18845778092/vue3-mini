var Vue = (function (exports) {
    'use strict';

    function normalizeClass(value) {
        var res = '';
        if (isString(value)) {
            res = value;
        }
        else if (isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                var normalized = normalizeClass(value[i]);
                if (normalized) {
                    res += normalized + ' ';
                }
            }
        }
        else if (isObject(value)) {
            for (var name_1 in value) {
                if (value[name_1]) {
                    res += name_1 + ' ';
                }
            }
        }
        return res.trim();
    }

    var isArray = Array.isArray;
    var isObject = function (val) {
        return val !== null && typeof val === 'object';
    };
    var hasChanged = function (value, oldValue) {
        return !Object.is(value, oldValue);
    };
    var isFunction = function (val) {
        return typeof val === 'function';
    };
    var isString = function (val) { return typeof val === 'string'; };
    var extend = Object.assign;
    // 是否以on开头
    var onRE = /^on[^a-z]/;
    var isOn = function (key) { return onRE.test(key); };
    var EMPTY_OBJ = {};

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var createDep = function (effects) {
        var dep = new Set(effects);
        return dep;
    };

    var targetMap = new WeakMap();
    var activeEffect;
    var ReactiveEffect = /** @class */ (function () {
        function ReactiveEffect(fn, scheduler) {
            if (scheduler === void 0) { scheduler = null; }
            this.fn = fn;
            this.scheduler = scheduler;
        }
        ReactiveEffect.prototype.run = function () {
            activeEffect = this;
            return this.fn();
        };
        ReactiveEffect.prototype.stop = function () {
            console.log('stop');
        };
        return ReactiveEffect;
    }());
    function effect(fn, options) {
        var _effect = new ReactiveEffect(fn);
        if (options) {
            extend(_effect, options); //合并调度器
        }
        if (!options || !options.lazy) {
            _effect.run(); //完成第一次执行
        }
    }
    function track(target, key) {
        console.log('收集依赖');
        if (!activeEffect)
            return;
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        var dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        trackEffects(dep);
    }
    function trigger(target, key, value) {
        var depsMap = targetMap.get(target);
        if (!depsMap)
            return; //没收集过
        var dep = depsMap.get(key);
        if (!dep)
            return;
        triggerEffects(dep);
    }
    function triggerEffects(dep) {
        var e_1, _a, e_2, _b;
        var effects = isArray(dep) ? dep : __spreadArray([], __read(dep), false);
        try {
            // for (const effect of effects) {
            //   triggerEffect(effect)
            // }
            for (var effects_1 = __values(effects), effects_1_1 = effects_1.next(); !effects_1_1.done; effects_1_1 = effects_1.next()) {
                var effect_1 = effects_1_1.value;
                if (effect_1.computed) {
                    triggerEffect(effect_1);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return)) _a.call(effects_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var effects_2 = __values(effects), effects_2_1 = effects_2.next(); !effects_2_1.done; effects_2_1 = effects_2.next()) {
                var effect_2 = effects_2_1.value;
                if (!effect_2.computed) {
                    triggerEffect(effect_2);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (effects_2_1 && !effects_2_1.done && (_b = effects_2.return)) _b.call(effects_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    function triggerEffect(effect) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
    function trackEffects(dep) {
        dep.add(activeEffect);
        // TODO
    }

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
        proxy["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */] = true;
        proxyMap.set(target, proxy);
        return proxy;
    }
    var toReactive = function (value) {
        return isObject(value) ? reactive(value) : value;
    };
    function isReactive(value) {
        return !!(value && value["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */]);
    }

    function ref(value) {
        return createRef(value, false);
    }
    function createRef(rawValue, shallow) {
        if (isRef(rawValue)) {
            return rawValue;
        }
        return new RefImpl(rawValue, shallow);
    }
    var RefImpl = /** @class */ (function () {
        function RefImpl(value, __v_isShallow) {
            this.__v_isShallow = __v_isShallow;
            this.dep = undefined;
            this.__v_isRef = true;
            this._rawValue = value;
            this._value = __v_isShallow ? value : toReactive(value);
        }
        Object.defineProperty(RefImpl.prototype, "value", {
            get: function () {
                trackRefValue(this);
                return this._value;
            },
            set: function (newVal) {
                if (hasChanged(newVal, this._rawValue)) {
                    this._rawValue = newVal;
                    this._value = toReactive(newVal);
                    triggerRefValue(this);
                }
            },
            enumerable: false,
            configurable: true
        });
        return RefImpl;
    }());
    function trackRefValue(ref) {
        if (activeEffect) {
            trackEffects(ref.dep || (ref.dep = createDep()));
        }
    }
    function triggerRefValue(ref) {
        if (ref.dep) {
            triggerEffects(ref.dep);
        }
    }
    function isRef(r) {
        return !!(r && r.__V_isRef === true);
    }

    var ComputedRefImpl = /** @class */ (function () {
        function ComputedRefImpl(getter) {
            var _this = this;
            this.dep = undefined;
            this.__v_isRef = true;
            this._dirty = true;
            this.effect = new ReactiveEffect(getter, function () {
                if (!_this._dirty) {
                    _this._dirty = true;
                    triggerRefValue(_this);
                }
            });
            this.effect.computed = this;
        }
        Object.defineProperty(ComputedRefImpl.prototype, "value", {
            get: function () {
                trackRefValue(this);
                // cache
                if (this._dirty) {
                    this._dirty = false;
                    this._value = this.effect.run();
                }
                return this._value;
            },
            enumerable: false,
            configurable: true
        });
        return ComputedRefImpl;
    }());
    function computed(getterOrOptions) {
        var getter;
        var onlyGetter = isFunction(getterOrOptions);
        if (onlyGetter) {
            getter = getterOrOptions;
        }
        var cRef = new ComputedRefImpl(getter);
        return cRef;
    }

    var isFlushPending = false;
    var resolvedPromise = Promise.resolve();
    var pendingPreFlushCbs = [];
    function queuePreFlushCb(cb) {
        queueCb(cb);
    }
    function queueCb(cb, pendingQueue) {
        pendingPreFlushCbs.push(cb);
        queueFlush(); //依次执行队列函数
    }
    // 依次执行队列函数
    function queueFlush() {
        if (!isFlushPending) {
            isFlushPending = true;
            // 第一个push到队列中的任务就会执行队列异步处理函数
            // 异步队列处理函数执行之前同步代码会执行完
            // 每处理一次异步队列时isFlushPending置为false
            resolvedPromise.then(flushJobs);
        }
    }
    // 真正处理队列的函数
    function flushJobs() {
        isFlushPending = false; //队列开始处理
        flushPreFlushCbs();
    }
    // 循环进行队列处理
    function flushPreFlushCbs() {
        if (pendingPreFlushCbs.length) {
            var activePreFlushCbs = __spreadArray([], __read(new Set(pendingPreFlushCbs)), false);
            pendingPreFlushCbs.length = 0;
            for (var i = 0; i < activePreFlushCbs.length; i++) {
                activePreFlushCbs[i]();
            }
        }
    }

    function watch(source, cb, options) {
        return doWatch(source, cb, options);
    }
    function doWatch(source, cb, _a) {
        var _b = _a === void 0 ? EMPTY_OBJ : _a, immediate = _b.immediate, deep = _b.deep;
        var getter;
        if (isReactive(source)) {
            getter = function () { return source; };
            deep = true;
        }
        else {
            getter = function () { };
        }
        // 依赖收集
        if (cb && deep) {
            // TODO
            var baseGetter_1 = getter; //浅拷贝
            getter = function () { return traverse(baseGetter_1()); };
        }
        var oldValue = {};
        // 拿到newValue
        var job = function () {
            if (cb) {
                var newValue = effect.run();
                if (deep || hasChanged(newValue, oldValue)) {
                    cb(newValue, oldValue);
                    oldValue = newValue;
                }
            }
        };
        var scheduler = function () { return queuePreFlushCb(job); };
        var effect = new ReactiveEffect(getter, scheduler);
        if (cb) {
            if (immediate) {
                job();
            }
            else {
                oldValue = effect.run();
            }
        }
        else {
            effect.run();
        }
        return function () {
            effect.stop();
        };
    }
    function traverse(value) {
        if (!isObject(value)) {
            return value;
        }
        for (var key in value) {
            traverse(value[key]);
        }
        return value;
    }

    var Fragment = Symbol('Fragment');
    var Text = Symbol('Text');
    var Comment = Symbol('Comment');
    function createVNode(type, props, children) {
        if (props) {
            var klass = props.class; props.style;
            if (klass && !isString(klass)) {
                props.class = normalizeClass(klass);
            }
        }
        // string则对应ELEMENT
        // 用于按位或运算
        var shapeFlag = isString(type)
            ? 1 /* ShapeFlags.ELEMENT */
            : isObject(type) //是对象的话就认为它是一个有状态的组件
                ? 4 /* ShapeFlags.STATEFUL_COMPONENT */
                : 0;
        return createBaseVNode(type, props, children, shapeFlag);
    }
    function createBaseVNode(type, props, children, shapeFlag) {
        var vnode = {
            __v_isVNode: true,
            type: type,
            props: props,
            children: children,
            shapeFlag: shapeFlag,
            key: (props === null || props === void 0 ? void 0 : props.key) || null
        };
        // 解析children
        normalizeChildren(vnode, children);
        return vnode;
    }
    function normalizeChildren(vnode, children) {
        var type = 0;
        // 根据状态解析children
        if (children == null) {
            children = null;
        }
        else if (isArray(children)) {
            type = 16 /* ShapeFlags.ARRAY_CHILDREN */;
        }
        else if (typeof children === 'object') ;
        else if (isFunction(children)) ;
        else {
            children = String(children);
            type = 8 /* ShapeFlags.TEXT_CHILDREN */;
        }
        vnode.children = children;
        // 按位或运算 转成32位二进制再执行
        // 1 ^ 8 都转成二进制 相同为0 不同为1 然后再转成10进制等于9
        // & 与运算 两个都为1为1  有一个不为1则0
        vnode.shapeFlag = vnode.shapeFlag | type;
    }
    function isVNode(value) {
        return value ? value.__v_isVNode === true : false;
    }
    function isSameVNodeType(n1, n2) {
        console.log('isSameVNodeType', n1.type === n2.type && n1.key === n2.key);
        return n1.type === n2.type && n1.key === n2.key;
    }

    function h(type, propsOrChildren, children) {
        var l = arguments.length;
        if (l === 2) {
            // 第二个参数是对象且不是数组
            if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
                // 如果是VNode 则当作children来用
                if (isVNode(propsOrChildren)) {
                    return createVNode(type, null, [propsOrChildren]);
                }
                return createVNode(type, propsOrChildren, []);
            }
            else {
                return createVNode(type, null, propsOrChildren);
            }
        }
        else {
            if (l > 3) {
                children = Array.prototype.slice.call(arguments, 2);
            }
            else if (l === 3 && isVNode(children)) {
                children = [children];
            }
            return createVNode(type, propsOrChildren, children);
        }
    }

    // bm beforeMount instance
    function injectHook(type, hook, target) {
        if (target) {
            target[type] = hook;
            return hook;
        }
    }
    var createHook = function (lifecycle) {
        return function (hook, target) { return injectHook(lifecycle, hook, target); };
    };
    var onBeforeMount = createHook("bm" /* LifecycleHooks.BEFORE_MOUNT */);
    var onMounted = createHook("m" /* LifecycleHooks.MOUNTED */);

    var uid = 0;
    function createComponentInstance(vnode) {
        var type = vnode.type;
        var instance = {
            uid: uid++,
            vnode: vnode,
            type: type,
            subTree: null,
            effect: null,
            update: null,
            render: null,
            isMounted: false,
            bc: null,
            c: null,
            bm: null,
            m: null
        };
        return instance;
    }
    function setupComponent(instance) {
        setupStatefulComponent(instance);
    }
    function setupStatefulComponent(instance) {
        var Component = instance.type;
        var setup = Component.setup;
        if (setup) {
            var setupResult = setup();
            handleSetupResult(instance, setupResult);
        }
        else {
            // optionsAPI
            finishComponentSetup(instance);
        }
    }
    function handleSetupResult(instance, setupResult) {
        if (isFunction(setupResult)) {
            instance.render = setupResult;
        }
        finishComponentSetup(instance);
    }
    function finishComponentSetup(instance) {
        //得到的是这个对象==>const component={render(){return h('div','hello')}}
        var Component = instance.type;
        if (!instance.render) {
            instance.render = Component.render;
        }
        applyOptions(instance);
    }
    function applyOptions(instance) {
        var _a = instance.type, dataOptions = _a.data, beforeCreate = _a.beforeCreate, created = _a.created, beforeMount = _a.beforeMount, mounted = _a.mounted;
        if (beforeCreate) {
            callHook(beforeCreate, instance.data);
        }
        if (dataOptions) {
            var data = dataOptions();
            if (isObject(data)) {
                instance.data = reactive(data);
            }
        }
        if (created) {
            callHook(created, instance.data);
        }
        function registerLifecycleHook(register, hook) {
            register(hook === null || hook === void 0 ? void 0 : hook.bind(instance.data), instance);
        }
        // 挂载前后调用,所以要先注入
        registerLifecycleHook(onBeforeMount, beforeMount);
        registerLifecycleHook(onMounted, mounted);
    }
    function callHook(hook, proxy) {
        hook.bind(proxy);
    }

    function renderComponentRoot(instance) {
        var vnode = instance.vnode, render = instance.render, data = instance.data;
        var result;
        try {
            if (vnode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
                result = normalizeVNode(render.call(data)); //我们定义的组件render函数返回vnode
            }
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    // 本质上是创建VNode的过程
    function normalizeVNode(child) {
        // child已经是对象旧说明当前child已经是VNode了
        if (typeof child === 'object') {
            return cloneIfMounted(child);
        }
        else {
            return createVNode(Text, null, String(child));
        }
    }
    function cloneIfMounted(child) {
        return child;
    }

    function createRenderer(options) {
        return baseCreateRenderer(options);
    }
    /**
     * 生成渲染器主函数 根据不同宿主环境
     */
    function baseCreateRenderer(options) {
        var hostCreateElement = options.createElement, hostSetElementText = options.setElementText, hostInsert = options.insert, hostPatchProp = options.patchProp, hostRemove = options.remove, hostCreateText = options.createText, hostSetText = options.setText, hostCreateComment = options.createComment;
        var processElement = function (oldVNode, newVNode, container, anchor) {
            if (oldVNode === null) {
                // 挂载
                mountElement(newVNode, container, anchor);
            }
            else {
                // TODO 更新
                patchElement(oldVNode, newVNode);
            }
        };
        var processText = function (oldVNode, newVNode, container, anchor) {
            if (oldVNode == null) {
                // 挂载
                newVNode.el = hostCreateText(newVNode.children);
                hostInsert(newVNode.el, container, anchor);
            }
            else {
                // 更新
                var el = (newVNode.el = oldVNode.el);
                if (newVNode.children !== oldVNode.children) {
                    hostSetText(el, newVNode.children);
                }
            }
        };
        var processComment = function (oldVNode, newVNode, container, anchor) {
            if (oldVNode == null) {
                // 挂载
                newVNode.el = hostCreateComment(newVNode.children);
                hostInsert(newVNode.el, container, anchor);
            }
            else {
                newVNode.el = oldVNode.el;
            }
        };
        var processFragment = function (oldVNode, newVNode, container, anchor) {
            if (oldVNode == null) {
                // 挂载
                mountChildren(newVNode.children, container, anchor);
            }
            else {
                patchChildren(oldVNode, newVNode, container, anchor);
            }
        };
        var processComponent = function (oldVNode, newVNode, container, anchor) {
            if (oldVNode == null) {
                mountComponent(newVNode, container, anchor);
            }
        };
        var mountComponent = function (initialVNode, container, anchor) {
            initialVNode.component = createComponentInstance(initialVNode);
            var instance = initialVNode.component;
            setupComponent(instance); //绑定render函数 处理data为响应式
            setupRenderEffect(instance, initialVNode, container, anchor); //渲染组件
        };
        // 渲染组件
        var setupRenderEffect = function (instance, initialVNode, container, anchor) {
            var componentUpdateFn = function () {
                // 挂载subTree
                if (!instance.isMounted) {
                    var bm = instance.bm, m = instance.m;
                    if (bm) {
                        bm();
                    }
                    // 根据组件定义的render 生成subTree subTree是一个VNode
                    var subTree = (instance.subTree = renderComponentRoot(instance));
                    patch(null, subTree, container, anchor);
                    if (m) {
                        m();
                    }
                    initialVNode.el = subTree.el;
                    instance.isMounted = true;
                }
                else {
                    var next = instance.next, vnode = instance.vnode;
                    if (!next) {
                        next = vnode;
                    }
                    // 此时instance上的data已经变化了
                    var nextTree = renderComponentRoot(instance);
                    // 将第一次挂载的tree拿出
                    var prevTree = instance.subTree;
                    instance.subTree = nextTree;
                    patch(prevTree, nextTree, container, anchor);
                    next.el = nextTree.el;
                }
            };
            var effect = (instance.effect = new ReactiveEffect(componentUpdateFn, function () { return queuePreFlushCb(update); }));
            var update = (instance.update = function () { return effect.run(); });
            update();
        };
        var mountElement = function (vnode, container, anchor) {
            var type = vnode.type, props = vnode.props, shapeFlag = vnode.shapeFlag;
            // 1.创建element
            var el = (vnode.el = hostCreateElement(type));
            // 2.设置文本
            if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
                // text children
                hostSetElementText(el, vnode.children);
            }
            else if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
                // array children
                mountChildren(vnode.children, el, anchor);
            }
            // 3.设置props
            if (props) {
                for (var key in props) {
                    hostPatchProp(el, key, null, props[key]);
                }
            }
            // 4.插入
            hostInsert(el, container, anchor);
        };
        var patchElement = function (oldVNode, newVNode) {
            var el = (newVNode.el = oldVNode.el);
            var oldProps = oldVNode.props || EMPTY_OBJ;
            var newProps = newVNode.props || EMPTY_OBJ;
            // 更新子节点
            patchChildren(oldVNode, newVNode, el, null);
            // 更新props
            patchProps(el, newVNode, oldProps, newProps);
        };
        var mountChildren = function (children, container, anchor) {
            if (isString(children)) {
                children = children.split('');
            }
            for (var i = 0; i < children.length; i++) {
                var child = (children[i] = normalizeVNode(children[i]));
                patch(null, child, container, anchor);
            }
        };
        var patchChildren = function (oldVNode, newVNode, container, anchor) {
            var c1 = oldVNode && oldVNode.children;
            var prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0;
            var c2 = newVNode && newVNode.children;
            var shapeFlag = newVNode.shapeFlag;
            // 新节点是text children
            if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
                if (c2 !== c1) {
                    // 挂载新子节点的文本 新旧节点的子节点都是text
                    hostSetElementText(container, c2);
                }
            }
            else {
                // 新节点不是text
                if (prevShapeFlag && 16 /* ShapeFlags.ARRAY_CHILDREN */) {
                    // 旧节点是array
                    if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
                        // 新旧都是array
                        // TODO:diff  真实的diff在这里运行
                        patchKeyedChildren(c1, c2, container, anchor);
                    }
                }
                else {
                    // 旧节点不是array
                    // 旧节点是text
                    if (prevShapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
                        // 旧节点是text 新节点不是text 删除旧节点text
                        hostSetElementText(container, '');
                    }
                }
            }
        };
        // diff函数
        var patchKeyedChildren = function (oldChildren, newChildren, container, parentAnchor) {
            var i = 0;
            var newChildrenLength = newChildren.length;
            var oldChildrenEnd = oldChildren.length - 1; //旧children最后一个元素下标
            var newChildrenEnd = newChildrenLength - 1; //新children最后一个元素下标
            // 1.自前向后
            while (i <= oldChildrenEnd && i <= newChildrenEnd) {
                var oldVNode = oldChildren[i];
                var newVNode = normalizeVNode(newChildren[i]);
                if (isSameVNodeType(oldVNode, newVNode)) {
                    patch(oldVNode, newVNode, container, null);
                }
                else {
                    break;
                }
                i++;
            }
            // 2.自后向前
            while (i <= oldChildrenEnd && i <= newChildrenEnd) {
                var oldVNode = oldChildren[oldChildrenEnd];
                var newVNode = normalizeVNode(newChildren[newChildrenEnd]);
                if (isSameVNodeType(oldVNode, newVNode)) {
                    patch(oldVNode, newVNode, container, null);
                }
                else {
                    break;
                }
                oldChildrenEnd--;
                newChildrenEnd--;
            }
            // 3.新节点多余旧节点
            if (i > oldChildrenEnd) {
                if (i <= newChildrenEnd) {
                    var nextPos = newChildrenEnd + 1;
                    var anchor = nextPos < newChildrenLength ? newChildren[nextPos].el : parentAnchor;
                    while (i <= newChildrenEnd) {
                        patch(null, normalizeVNode(newChildren[i]), container, anchor);
                        i++;
                    }
                }
            }
            // 4.新节点少于旧节点
            else if (i > newChildrenEnd) {
                while (i <= oldChildrenEnd) {
                    unmount(oldChildren[i]);
                    i++;
                }
            }
            // 乱序
            else {
                var oldStartIndex = i; // 旧节点开始索引 oldChildrenStart
                var newStartIndex = i; // 新节点开始索引
                //假设传入[1,3,2,4,6,5]
                // 5.1 创建一个map对象 以新节点的key作为key，新节点的位置作为value
                var keyToNewIndexMap = new Map();
                // 对于新节点的循环 检查key 设置keytoIndex Map
                for (i = newStartIndex; i <= newChildrenEnd; i++) {
                    var nextChild = normalizeVNode(newChildren[i]);
                    if (nextChild.key != null) {
                        // key必须存在且唯一
                        // if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
                        //   warn(
                        //     `Duplicate keys found during update:`,
                        //     JSON.stringify(nextChild.key),
                        //     `Make sure keys are unique.`
                        //   )
                        // }
                        // 设置key
                        keyToNewIndexMap.set(nextChild.key, i);
                    }
                }
                //
                // 5.2 循环旧节点 并且尝试打补丁或删除
                var j = void 0;
                var patched = 0; //记录已经修复的新节点的数量
                var toBePatched = newChildrenEnd - newStartIndex + 1; //新节点待修补数量
                var moved = false; //当前节点是否需要进行移动 5.3使用
                var maxNewIndexSoFar = 0; //始终保存当前最大的index的值
                // works as Map<newIndex, oldIndex>
                // Note that oldIndex is offset by +1
                // and oldIndex = 0 is a special value indicating the new node has
                // no corresponding old node.
                // used for determining longest stable subsequence
                // 这里的注释说的稍微有点问题，它并不是创建了一个Map对象
                // 它是用Array表达Map的概念
                // 对于数组而言它既有元素的值 又有元素的下标值
                // 这个数组它的下标表示新节点下标 元素代表旧节点下标
                // 注意它里面的元素是不计算已经处理好的节点的
                // 虽然存放的是旧节点下标,但是旧节点下标永远+1
                // 并且这个newIndexToOldIndexMap还会用来确定最长递增子序列
                var newIndexToOldIndexMap = new Array(toBePatched);
                // 当前的0包含一些特殊含义 value去表示旧节点下标时不可以直接用0
                // 所以所有旧节点下标要+1
                for (i = 0; i < toBePatched; i++)
                    newIndexToOldIndexMap[i] = 0;
                // 便利旧节点
                for (i = oldStartIndex; i <= oldChildrenEnd; i++) {
                    var prevChild = oldChildren[i];
                    // 已经处理好的节点大于等于待处理节点 代表已经处理好了
                    // 旧节点全部删除就好了
                    if (patched >= toBePatched) {
                        unmount(prevChild);
                        continue;
                    }
                    var newIndex 
                    // 它向newIndexToOldIndexMap扔,index需要减去前面已经处理好的数量
                    = void 0; //当前旧节点在新节点数组中存在的位置  它是计算已处理节点的
                    // 它向newIndexToOldIndexMap扔,index需要减去前面已经处理好的数量
                    if (prevChild.key != null) {
                        newIndex = keyToNewIndexMap.get(prevChild.key);
                    }
                    else {
                        // 所有节点是都有对应key的 示例中进不去
                        // else的作用是遍历所有新节点 找到没有对应旧节点的新节点
                        // 如果旧节点没有key 还是希望尽量能把旧节点的newIndex找到
                        // 边缘情况
                        for (j = newStartIndex; j <= newChildrenEnd; j++) {
                            if (newIndexToOldIndexMap[j - newStartIndex] === 0 && //还是等于0
                                isSameVNodeType(prevChild, newChildren[j]) //新旧可以匹配上
                            ) {
                                newIndex = j;
                                break;
                            }
                        }
                    }
                    if (newIndex === undefined) {
                        // 当前旧节点没有对应新节点 需要卸载
                        unmount(prevChild);
                    }
                    else {
                        // newIndex - s2 为了不计算已经处理过的节点 新节点减去i的起始值 s2
                        // i的起始值代表前面处理过了几个节点了
                        // i + 1 对应旧节点下标永远+1
                        newIndexToOldIndexMap[newIndex - newStartIndex] = i + 1;
                        // maxNewIndexSoFar 存放如果最大index
                        // 判断当前旧节点是否需要移动逻辑
                        if (newIndex >= maxNewIndexSoFar) {
                            maxNewIndexSoFar = newIndex;
                        }
                        else {
                            // 如果某一个旧节点的新index小于当前最大index
                            // newIndex < maxNewIndexSoFar
                            // 代表没有递增,则代表有节点需要移动
                            moved = true;
                        }
                        // 更新完还需要移动 在5.3
                        patch(prevChild, newChildren[newIndex], container, null);
                        patched++;
                    }
                }
                // 5.3 对5.2处理完的结果进行移动和挂载新节点
                var increasingNewIndexSequence = moved
                    ? getSequence(newIndexToOldIndexMap)
                    : [];
                j = increasingNewIndexSequence.length - 1; //当前递增子序列的最后一个下标
                for (i = toBePatched - 1; i >= 0; i--) {
                    // s2 newStart
                    var nextIndex = newStartIndex + i; //需要更新的新节点下标 计算已经处理过的
                    var nextChild = newChildren[nextIndex];
                    var anchor = 
                    // 锚点是否超过newChildren的长度 没超过就在当前位置的后面
                    nextIndex + 1 < newChildrenLength
                        ? newChildren[nextIndex + 1].el
                        : parentAnchor;
                    // 新节点没有对应的旧节点 表示新增的节点
                    if (newIndexToOldIndexMap[i] === 0) {
                        // mount new
                        patch(null, nextChild, container, anchor);
                    }
                    else if (moved) {
                        // j < 0 表示不存在最长递增子序列
                        // i !== increasingNewIndexSequence[j] 表示当前节点不在最后位置
                        if (j < 0 || i !== increasingNewIndexSequence[j]) {
                            move(nextChild, container, anchor);
                        }
                        else {
                            j--;
                        }
                    }
                }
            }
        };
        var move = function (vnode, container, anchor) {
            var el = vnode.el;
            hostInsert(el, container, anchor);
        };
        var patchProps = function (el, vnode, oldProps, newProps) {
            if (oldProps !== newProps) {
                for (var key in newProps) {
                    var next = newProps[key];
                    var prev = oldProps[key];
                    // 新旧prop不同就patch
                    if (next !== prev) {
                        hostPatchProp(el, key, prev, next);
                    }
                }
                // 再进行一次旧props循环
                // 如果新的prop没有，旧的有  那么删除新props中新增的prop
                if (oldProps !== EMPTY_OBJ) {
                    for (var key in oldProps) {
                        if (!(key in newProps)) {
                            hostPatchProp(el, key, oldProps[key], null);
                        }
                    }
                }
            }
        };
        var patch = function (oldVNode, newVNode, container, anchor) {
            if (anchor === void 0) { anchor = null; }
            if (oldVNode === newVNode) {
                return;
            }
            // 旧节点存在且新节点不是相同类型直接卸载旧节点 走挂载新节点逻辑
            if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
                console.log('直接卸载');
                unmount(oldVNode);
                oldVNode = null;
            }
            var type = newVNode.type, shapeFlag = newVNode.shapeFlag;
            console.log('shapeFlag和type', shapeFlag, type);
            switch (type) {
                case Text:
                    processText(oldVNode, newVNode, container, anchor);
                    break;
                case Comment:
                    processComment(oldVNode, newVNode, container, anchor);
                    break;
                case Fragment:
                    processFragment(oldVNode, newVNode, container, anchor);
                    break;
                default:
                    // 分两种 Element 和 组件
                    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
                        processElement(oldVNode, newVNode, container, anchor);
                    }
                    else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
                        processComponent(oldVNode, newVNode, container, anchor);
                    }
            }
        };
        var unmount = function (vnode) {
            hostRemove(vnode.el);
        };
        var render = function (vnode, container) {
            if (vnode === null) {
                // 卸载
                if (container._vnode) {
                    unmount(container._vnode);
                }
            }
            else {
                patch(container._vnode || null, vnode, container);
            }
            container._vnode = vnode;
        };
        return {
            render: render
        };
    }
    // 求解最长递增子序列元素所在的下标
    // 贪心+二分查找算法计算
    // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
    function getSequence(arr) {
        //假设传入[1,3,2,4,6,5]
        var p = arr.slice(); //result每次变化时，记录result更新前最后一个索引的值
        var result = [0]; //最长递增子序列下标返回值，默认包含第一个元素
        var i, j, u, v, c;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            var arrI = arr[i];
            if (arrI !== 0) {
                // j代表result中最后一个元素 也就是result中保存的最大值
                j = result[result.length - 1];
                if (arr[j] < arrI) {
                    p[i] = j; //在result变化之前记录result更新前最后一个索引的值
                    result.push(i);
                    continue;
                }
                // 二分查找运算
                u = 0; //二分查找初始下标
                v = result.length - 1; //二分查找结束下标
                // 二分查找逻辑
                while (u < v) {
                    // c是中间位置
                    c = (u + v) >> 1; //往右进一位 意思是平分向下取整
                    if (arr[result[c]] < arrI) {
                        u = c + 1;
                    }
                    else {
                        v = c;
                    }
                }
                //替换为更小的元素的下标
                if (arrI < arr[result[u]]) {
                    if (u > 0) {
                        //似乎防止报错的逻辑
                        p[i] = result[u - 1];
                    }
                    result[u] = i;
                }
            }
        }
        // 回溯
        u = result.length;
        v = result[u - 1];
        while (u-- > 0) {
            result[u] = v;
            v = p[v];
        }
        return result;
    }

    var doc = (typeof document !== 'undefined' ? document : null);
    var nodeOps = {
        createElement: function (tag) {
            var el = doc.createElement(tag);
            return el;
        },
        setElementText: function (el, text) {
            el.textContent = text;
        },
        insert: function (child, parent, anchor) {
            parent.insertBefore(child, anchor || null);
        },
        remove: function (child) {
            var parent = child.parentNode;
            if (parent) {
                parent.removeChild(child);
            }
        },
        createText: function (text) { return doc.createTextNode(text); },
        setText: function (node, text) { return (node.nodeValue = text); },
        createComment: function (text) { return doc.createComment(text); }
    };

    function patchAttr(el, key, value) {
        if (value === null) {
            // value是空 删掉
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, value);
        }
    }

    function patchClass(el, value) {
        if (value === null) {
            // 删除class
            el.removeAttribute('class'); //使用remove 不使用setAttribute
        }
        else {
            el.className = value;
        }
    }

    function patchEvent(el, rawName, prevValue, nextValue) {
        var invokers = el._vei || (el._vei = {});
        var existingInvoker = invokers[rawName];
        if (nextValue && existingInvoker) {
            //更新行为
            existingInvoker.value = nextValue;
        }
        else {
            var name_1 = parseName(rawName);
            // 新增 or 删除
            if (nextValue) {
                // 新增
                var invoker = (invokers[rawName] = createInvoker(nextValue));
                el.addEventListener(name_1, invoker);
            }
            else if (existingInvoker) {
                // 删除
                el.removeEventListener(name_1, existingInvoker);
                invokers[rawName] = undefined;
            }
        }
    }
    function parseName(name) {
        return name.slice(2).toLocaleLowerCase();
    }
    function createInvoker(initalValue) {
        var invoker = function (e) {
            invoker.value && invoker.value();
        };
        invoker.value = initalValue;
        return invoker;
    }

    function patchDomProp(el, key, value) {
        try {
            el[key] = value;
        }
        catch (e) { }
    }

    function patchStyle(el, prev, next) {
        var style = el.style; //all style
        var isCssString = isString(next);
        if (next && !isCssString) {
            for (var key in next) {
                setStyle(style, key, next[key]);
            }
        }
        // 清除本次没有的旧样式
        if (prev && !isString(prev)) {
            for (var key in prev) {
                if (next[key] == null) {
                    setStyle(style, key, '');
                }
            }
        }
    }
    function setStyle(style, name, val) {
        // 只考虑简单的对象
        style[name] = val;
    }

    var patchProp = function (el, key, prevValue, nextValue) {
        if (key === 'class') {
            patchClass(el, nextValue);
        }
        else if (key === 'style') {
            patchStyle(el, prevValue, nextValue);
        }
        else if (isOn(key)) {
            // on开头  事件
            patchEvent(el, key, prevValue, nextValue);
        }
        else if (shouldSetAsProp(el, key)) {
            // property
            patchDomProp(el, key, nextValue);
        }
        else {
            // attribute
            patchAttr(el, key, nextValue);
        }
    };
    function shouldSetAsProp(el, key) {
        if (key === 'form') {
            // 对于表单元素 form属性是只读的
            return false;
        }
        if (key === 'list' && el.tagName === 'INPUT') {
            // input的list属性必须通过attribute设定
            return false;
        }
        if (key === 'type' && el.tagName === 'TEXTAREA') {
            return false;
        }
        return key in el;
    }

    var renderOptions = extend({ patchProp: patchProp }, nodeOps);
    var renderer;
    function ensureRenderer() {
        return renderer || (renderer = createRenderer(renderOptions));
    }
    var render = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = ensureRenderer()).render.apply(_a, __spreadArray([], __read(args), false));
    };

    function createParseContext(content) {
        // return context上下文对象
        return {
            source: content
        };
    }
    function createRoot(children) {
        return {
            type: 0 /* NodeTypes.ROOT */,
            children: children,
            loc: {}
        };
    }
    function baseParse(content) {
        var context = createParseContext(content);
        var children = parseChildren(context, []);
        console.log('children', children);
        // return javascript ast
        return createRoot(children);
    }
    function parseChildren(context, ancestors) {
        var nodes = []; //是将来ast中的children
        while (!isEnd(context, ancestors)) {
            var s = context.source;
            var node = void 0;
            if (startsWith(s, '{{')) ;
            else if (s[0] === '<') {
                // 标签的开始
                if (/[a-z]/i.test(s[1])) {
                    // 处理标签
                    node = parseElement(context, ancestors);
                }
            }
            if (!node) {
                // 既不是模板语法也不是< 就只可能是文本节点
                node = parseText(context);
            }
            pushNode(nodes, node);
        }
        return nodes;
    }
    // 返回的是AST,只不过是一层一层的AST 类似递归一样最后靠children组合在一起
    function parseElement(context, ancestors) {
        // 1.处理标签的开始
        var element = parseTag(context);
        ancestors.push(element);
        // 2.处理标签的children
        var children = parseChildren(context, ancestors);
        ancestors.pop();
        element.children = children;
        // 3.处理标签的结束
        // 如果是结束标签的开始的话
        if (startsWithEndTagOpen(context.source, element.tag)) {
            parseTag(context);
        }
        return element;
    }
    function parseTag(context, type) {
        var match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source);
        var tag = match[1];
        advanceBy(context, match[0].length);
        var isSelfClosing = startsWith(context.source, '/>');
        advanceBy(context, isSelfClosing ? 2 : 1);
        return {
            tag: tag,
            type: 1 /* NodeTypes.ELEMENT */,
            tagType: 0 /* ElementTypes.ELEMENT */,
            props: [],
            children: []
        };
    }
    // 解析文本
    function parseText(context) {
        var endTokens = ['<', '{{']; //普通文本的结束 白名单
        var endIndex = context.source.length; //最大值
        for (var i = 0; i < endTokens.length; i++) {
            var index = context.source.indexOf(endTokens[i], i);
            if (index !== -1 && endIndex > index) {
                endIndex = index; //普通文本结束下标
            }
        }
        var content = parseTextData(context, endIndex);
        return {
            type: 2 /* NodeTypes.TEXT */,
            content: content
        };
    }
    // 截取text文本内容
    function parseTextData(context, length) {
        var rawText = context.source.slice(0, length);
        advanceBy(context, length);
        return rawText;
    }
    function pushNode(nodes, node) {
        nodes.push(node);
    }
    // ancestors数组 会放element node节点
    function isEnd(context, ancestors) {
        var s = context.source;
        if (startsWith(s, '</')) {
            for (var i = ancestors.length - 1; i >= 0; i--) {
                if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                    return true;
                }
            }
        }
        return !s;
    }
    function startsWithEndTagOpen(source, tag) {
        return startsWith(source, '</');
    }
    function startsWith(source, searchString) {
        return source.startsWith(searchString);
    }
    // 右移
    function advanceBy(context, numberOfCharacters) {
        var source = context.source;
        context.source = source.slice(numberOfCharacters);
    }

    function isSingleElementRoot(root, child) {
        var children = root.children;
        return children.length === 1 && child.type === 1 /* NodeTypes.ELEMENT */;
    }

    function createTransformContext(root, _a) {
        var _b = _a.nodeTransforms, nodeTransforms = _b === void 0 ? [] : _b;
        var context = {
            nodeTransforms: nodeTransforms,
            root: root,
            helpers: new Map(),
            currentNode: root,
            parent: null,
            childIndex: 0,
            // helper配合helpers使用，主要往里放东西
            helper: function (name) {
                var count = context.helpers.get(name) || 0;
                context.helpers.set(name, count + 1);
                return name;
            }
        };
        return context;
    }
    function transform(root, options) {
        var context = createTransformContext(root, options);
        traverseNode(root, context); //从根节点开始依次处理所有节点
        createRootCodegen(root);
        root.helpers = __spreadArray([], __read(context.helpers.keys()), false);
        root.components = [];
        root.directives = [];
        root.imports = [];
        root.hoists = [];
        root.temps = [];
        root.cached = [];
    }
    function traverseNode(node, context) {
        // 深度优先 子==>父
        // 分两个阶段:
        // 1.进入阶段：存储所有节点的转化函数到exitFns中
        context.currentNode = node;
        var nodeTransforms = context.nodeTransforms;
        var exitFns = [];
        for (var i_1 = 0; i_1 < nodeTransforms.length; i_1++) {
            var onExit = nodeTransforms[i_1](node, context);
            if (onExit) {
                exitFns.push(onExit);
            }
        }
        switch (node.type) {
            case 1 /* NodeTypes.ELEMENT */:
            case 0 /* NodeTypes.ROOT */:
                // 处理子节点
                traverseChildren(node, context);
                break;
        }
        // 2.退出阶段：执行exitFns中的转化函数，且是倒叙的，保证深度优先
        context.currentNode = node;
        var i = exitFns.length;
        while (i--) {
            exitFns[i]();
        }
    }
    function traverseChildren(parent, context) {
        parent.children.forEach(function (node, index) {
            context.parent = parent;
            context.childIndex = index;
            traverseNode(node, context);
        });
    }
    function createRootCodegen(root) {
        var children = root.children;
        // Vue2仅支持单个根节点
        if (children.length === 1) {
            var child = children[0];
            if (isSingleElementRoot(root, child) && child.codegenNode) {
                root.codegenNode = child.codegenNode;
            }
        }
        // Vue3支持多个
    }

    var _a;
    var CREATE_ELEMENT_VNODE = Symbol('createElementVNode');
    var CREATE_VNODE = Symbol('createVNode');
    (_a = {},
        _a[CREATE_ELEMENT_VNODE] = 'createElementVNode',
        _a[CREATE_VNODE] = 'createVNode',
        _a);

    function createVNodeCall(context, tag, props, children) {
        if (context) {
            context.helper(CREATE_ELEMENT_VNODE);
        }
        return {
            type: 13 /* NodeTypes.VNODE_CALL */,
            tag: tag,
            props: props,
            children: children
        };
    }

    var transformElement = function (node, context) {
        // element节点转化函数
        return function postTransformElement() {
            node = context.currentNode;
            if (node.type != 1 /* NodeTypes.ELEMENT */) {
                return;
            }
            var tag = node.tag;
            var vnodeTag = "\"".concat(tag, "\"");
            var vnodeProps = [];
            var vnodeChildren = node.children;
            node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren);
        };
    };

    function isText(node) {
        return node.type === 5 /* NodeTypes.INTERPOLATION */ || node.type === 2 /* NodeTypes.TEXT */;
    }

    // 将相邻的文本节点和表达式合并成一个表达式
    var transformText = function (node, context) {
        if (node.type === 0 /* NodeTypes.ROOT */ ||
            node.type === 1 /* NodeTypes.ELEMENT */ ||
            node.type === 11 /* NodeTypes.FOR */ ||
            node.type === 10 /* NodeTypes.IF_BRANCH */) {
            return function () {
                var children = node.children;
                var currentContainer;
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (isText(child)) {
                        // j是child的下一个子节点
                        for (var j = i + 1; j < children.length; j++) {
                            var next = children[j];
                            if (!currentContainer) {
                                // 创建符合表达式的节点
                                currentContainer = children[i] = createCompundExpression([child], child.loc);
                            }
                            if (isText(next)) {
                                // 尝试合并
                                currentContainer.children.push("+", next); //[child,'+',next]合并
                                children.splice(j, 1);
                                j--;
                            }
                            else {
                                // 第一个节点是text 第二个不是 不需要合并
                                currentContainer = undefined;
                                break;
                            }
                        }
                    }
                }
            };
        }
    };
    function createCompundExpression(children, loc) {
        return {
            type: 8 /* NodeTypes.COMPOUND_EXPRESSION */,
            loc: loc,
            children: children
        };
    }

    function baseCompile(template, options) {
        if (options === void 0) { options = {}; }
        var ast = baseParse(template);
        transform(ast, extend(options, {
            nodeTransforms: [transformElement, transformText]
        }));
        console.log(ast);
        console.log('ast', JSON.stringify(ast));
        return {};
    }

    function compile(template, options) {
        return baseCompile(template, options);
    }

    exports.Comment = Comment;
    exports.Fragment = Fragment;
    exports.Text = Text;
    exports.compile = compile;
    exports.computed = computed;
    exports.effect = effect;
    exports.h = h;
    exports.queuePreFlushCb = queuePreFlushCb;
    exports.reactive = reactive;
    exports.ref = ref;
    exports.render = render;
    exports.watch = watch;

    return exports;

})({});
//# sourceMappingURL=vue.js.map
