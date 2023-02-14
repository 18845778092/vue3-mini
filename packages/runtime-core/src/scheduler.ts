let isFlushPending = false
const resolvedPromise = Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> //当前执行的微任务
const pendingPreFlushCbs: Function[] = []

export function queuePreFlushCb(cb: Function) {
  queueCb(cb, pendingPreFlushCbs)
}

function queueCb(cb: Function, pendingQueue: Function[]) {
  pendingPreFlushCbs.push(cb)
  queueFlush() //依次执行队列函数
}

// 依次执行队列函数
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    // 第一个push到队列中的任务就会执行队列异步处理函数
    // 异步队列处理函数执行之前同步代码会执行完
    // 每处理一次异步队列时isFlushPending置为false
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

// 真正处理队列的函数
function flushJobs() {
  isFlushPending = false //队列开始处理
  flushPreFlushCbs()
}

// 循环进行队列处理
export function flushPreFlushCbs() {
  if (pendingPreFlushCbs.length) {
    let activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
    pendingPreFlushCbs.length = 0

    for (let i = 0; i < activePreFlushCbs.length; i++) {
      activePreFlushCbs[i]()
    }
  }
}
