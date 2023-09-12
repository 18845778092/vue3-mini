const queue: any[] = [] // 视图更新之后队列
const activePreFlushCbs: any[] = []
let isFlushPending = false
const p = Promise.resolve()

export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }
  queueFlush()
}

function queueFlush() {
  // 仅创建一次微任务队列
  if (isFlushPending) return
  isFlushPending = true
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false
  flushPreFlushCbs() // 视图更新之前执行队列

  let job
  while ((job = queue.shift())) {
    job && job()
  }
}

export function queuePreFlushCb(job) {
  activePreFlushCbs.push(job)
  queueFlush()
}

function flushPreFlushCbs() {
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]()
  }
}
