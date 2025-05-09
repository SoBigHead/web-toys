# 添加 InteractiveBox 项目

本项目是一个简单的交互式盒子，用户可以通过悬停和点击来改变盒子的颜色和显示的文本。

## 文件结构

- `InteractiveBox/index.html`: 包含玩具的HTML、CSS和JavaScript代码。

## 添加到主导航

在根目录的 `index.html` 文件中，添加了以下链接到新的玩具：

```html
<a href="InteractiveBox/index.html" class="button">互动盒子 (Interactive Box)</a>
```

## Cloudflare Pages 部署

如果需要单独部署此项目，可以将 Cloudflare Pages 的 `Build output directory` 设置为 `InteractiveBox`。但是，由于项目现在使用统一导航入口，根目录 `/` 仍然是推荐的设置，以确保所有玩具都可以从主页访问。