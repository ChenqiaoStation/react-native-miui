# react-native-miui

React Native 通用组件库，参照 `MIUI 7` 的设计效果，致力于给用户更好的体验。只要时间允许我会每周 `Pulish` 一个组件。争取以后 `UI` 组件库直接用 `MIUI` 全家桶就可以了。

PS: 在 `2022年3月13号` 的凌晨 `12点`，创建了 `raect-native-miui` 仓库，并且提交了第一个组件 ~~`Colorful`~~`Button`。
从此走上了造轮子之路。

## 😍 组件特色

### 设计思想

- 都 `2202年` 了，现在我还有一台 `MI 2s` 没舍得扔，毕竟当年的 `MIUI 7` 的设计至今应该还没有被超越。所以这个组件库大部分组件的设计思想就是 `MIUI 7`，组件的反馈效果也是参考的 `MIUI 7`。

- 目前我的手机里面装了好几百个 `APP`，没事儿的时候，我就随机点几个 `APP`，挨个页面看页面怎么设计的、组件怎么设计的，找一些灵感。只要感觉有 `花🌹里🍐胡🐯哨🔥` 的组件，就撸一个出来。然后 `Publish`。

### 配色方案

在 `MIUI 7` 设计的基础上，参照 `Material Design` 配色。

### 动画效果

尽可能的使用 `原生驱动 `动画效果，给用户平滑的体验，每一个组件的动画都经历了 `N` 次动画参数的调整。

### 可扩展性

既可以尽可能的少用参数就能体验到组件的 `基础功能`，又提供了丰富的扩展参数。

## 😌 命名规范

因为用的是 `react-native` 纯 `JS` 原始组件实现，所以命名规则尽可能参照原始 `Component` 原有的属性或者回调函数。

## 🤔 如何使用

[Please visit doc.cctv3.net。](https://doc.cctv3.net)

## 😡 已知问题

### `TypeScript` 的支持

[Using "useImperativeHandle" in a React functional component, with automatic TypeScript typing.](https://gist.github.com/Venryx/7cff24b17867da305fff12c6f8ef6f96)

如果组件通过 `ref` 访问不到属性的时候，报错:

```javascript
Property 'xxx' does not exist on type 'never'.
```

请在项目根目录添加 `tsconfig.json`。

```json
{
  "compilerOptions": {
    "module": "ES2015",
    "moduleResolution": "node",
    "target": "esnext",
    "lib": ["es5", "es6", "ESNext", "dom"],
    "jsx": "react",
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "alwaysStrict": true
  }
}
```
