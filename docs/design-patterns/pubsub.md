---
title: 发布订阅
slug: /
---

```js
var pubsub = {
  event: {},
  publish(key) {
    const events = this.event[key];
    for (let fn in events) {
      fn.call(this, ...arguments);
    }
  },
  subscribe(key, fn) {
    if (!this.event[key]) {
      this.event[key] = [];
    }

    console.log(fn);

    this.event[key].push(fn);
  },
  unsubscribe(key, fn) {
    if (!this.event[key]) {
      return;
    }

    const events = this.event[key];

    // 不传入指定key就清空当前key的所有订阅
    if (!fn) {
      events.length = 0;
    } else {
      const index = events.findIndex((item) => item === fn);
      events.splice(index, 1);
    }
  },
};

pubsub.publish("onwork", "9:00");
pubsub.publish("offwork", "18:00");

pubsub.subscribe("onwork", (time) => {
  console.log(`上班时间：${time}`);
});

pubsub.subscribe("offwork", (time) => {
  console.log(`下班时间：${time}`);
});

// pubsub.unsubscribe("offwork");
// pubsub.unsubscribe("offwork", () => {});
```
