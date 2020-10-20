# C

## What

canvas 2d render

## Class

### Scene

```js
const scene = new c.Scene({
  width: 800,
  height: 800,
});
```

### Group

```js
const group = new c.Group();
```

### Shape

#### Rect

```js
const rect = new c.Rect({
  width: 5,
  height: 5,
  lineWidth: 3,
  strokeStyle: color(),
  cursor: 'pointer',
});
```

### API

#### translate(tx,tx)

```js
rect.translate(30, 30);
```

#### moveTo(targetX,targetY)

```js
rect.moveTo(30, 30);
```

#### scale(sx,sy)

```js
rect.scale(30, 30);
```

#### rotate(radian)

```js
rect.rotate(30);
```
