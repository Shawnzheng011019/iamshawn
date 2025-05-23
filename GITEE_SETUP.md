# Gitee 镜像仓库设置指南

## 为什么需要 Gitee 镜像？

GitHub 在国内访问速度较慢，通过 Gitee 镜像可以：
- 🚀 提升博客内容加载速度
- 🇨🇳 优化国内用户访问体验
- 📱 确保移动端稳定访问
- ⚡ 作为 GitHub 的可靠备用方案

## 快速设置步骤

### 1. 创建 Gitee 账号
访问 [Gitee.com](https://gitee.com) 注册账号

### 2. 导入 GitHub 仓库
1. 登录 Gitee 后，点击右上角 "+" → "从 GitHub/GitLab 导入仓库"
2. 填写信息：
   - **GitHub 仓库地址**: `https://github.com/Shawnzheng011019/iamshawn`
   - **仓库名称**: `iamshawn`
   - **路径**: `Shawnzheng011019/iamshawn`
   - **开源**: 选择"公开"

### 3. 设置自动同步
1. 进入 Gitee 仓库 → "管理" → "仓库镜像管理"
2. 点击"添加镜像"
3. 选择"GitHub"，输入源仓库地址
4. 开启"强制同步"（覆盖 Gitee 仓库）

### 4. 更新博客配置
博客已自动配置 Gitee 数据源，无需手动修改。

当前数据源优先级：
1. **Vercel 本地** - 最优速度
2. **Gitee 镜像** - 国内高速访问 
3. **jsDelivr CDN** - 国内 CDN 加速
4. **GitHub Raw** - 官方源
5. **其他备用源** - 故障转移

## 推送代码到 Gitee

由于您已经创建了 Gitee 仓库，现在可以将代码推送到 Gitee：

```bash
# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/Shawnzheng011019/iamshawn.git

# 推送代码到 Gitee
git push gitee main:master

# 设置默认分支跟踪
git branch --set-upstream-to=gitee/master master
```

## 手动触发同步

如果需要立即同步最新内容：

1. 访问 Gitee 仓库页面
2. 点击"刷新"按钮（在仓库名称旁边）
3. 等待同步完成（通常1-2分钟）

## 验证设置

访问您的博客页面，检查：
- 文章列表是否正常加载
- 图片是否显示正常
- 搜索功能是否工作
- 文章详情是否可以打开

## 故障排除

### 问题1：Gitee 仓库创建失败
**解决方案**：
- 确保 GitHub 仓库是公开的
- 检查仓库名称是否包含特殊字符
- 稍后重试，Gitee 服务器可能繁忙

### 问题2：博客仍然加载缓慢
**解决方案**：
- 清除浏览器缓存
- 检查网络连接
- 博客会自动尝试多个数据源

### 问题3：数据不同步
**解决方案**：
- 手动触发 Gitee 同步
- 检查 GitHub 是否有新的提交
- 等待 5-10 分钟让 CDN 缓存更新

## 高级配置

### 自定义 Gitee 地址
当前配置的 Gitee 地址：`https://gitee.com/Shawnzheng011019/iamshawn/raw/master`

如果需要修改，请更新 `blog/js/blog.js` 文件中的配置：

```javascript
{
    name: 'Gitee Mirror',
    baseUrl: 'https://gitee.com/Shawnzheng011019/iamshawn/raw/master',
    priority: 2,
    description: 'Gitee 国内镜像'
}
```

### 添加更多数据源
您可以在 `DATA_SOURCES` 数组中添加更多备用数据源，比如：
- Gitlab 镜像
- Coding.net 镜像
- 自定义 CDN

## 监控和统计

博客系统会自动：
- 监控各数据源的响应时间
- 记录最优数据源到本地存储
- 在控制台显示数据源切换日志

打开浏览器开发者工具 → Console 查看详细日志。

## 联系支持

如果遇到问题，请：
1. 检查浏览器控制台错误信息
2. 确认网络连接正常
3. 通过 [Issues](https://github.com/Shawnzheng011019/iamshawn/issues) 反馈问题

---

**提示**：首次访问可能需要1-2分钟来检测最佳数据源，后续访问会自动使用缓存的最优配置。 