# 飞机设计工程学填空题复习系统

## 在线地址
> https://xdnotpatrickstar.github.io/nwpu-planedesign-review/

## 使用方式
1. 打开网址，输入昵称开始刷题
2. 不同用户数据完全隔离（各自浏览器的 localStorage）
3. 114 道填空题，严格按原文档顺序排列
4. 支持顺序练习、随机练习、领域筛选、模拟考试、错题本等

## 本地运行
```bash
python serve.py
```
然后浏览器打开 http://localhost:8080

## 部署到 GitHub Pages
1. 在 GitHub 新建仓库（如 `nwpu-plane-review`）
2. 推送代码：
```bash
git remote add origin https://github.com/你的用户名/nwpu-plane-review.git
git branch -M main
git add -A
git commit -m "init"
git push -u origin main
```
3. 仓库 → Settings → Pages → Source 选 `main` → Save
4. 等 1-2 分钟，访问 `https://你的用户名.github.io/nwpu-plane-review/`

## 部署到 Cloudflare Pages
1. 在 Cloudflare 注册 → Workers & Pages → Pages → 连接到 GitHub
2. 选择仓库 → 直接部署（无需构建命令，输出目录留空）
3. 获得 `https://xxx.pages.dev` 域名（全球加速，国内访问快）
