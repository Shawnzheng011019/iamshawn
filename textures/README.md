# 🌌 太空漫游 - 纹理素材指南

这个文件夹包含太空漫游页面中星球和空间环境的纹理贴图。

## 📁 文件夹结构

```
textures/
├── planets/          # 星球纹理贴图
│   ├── earth.jpg     # 地球纹理 (关于我)
│   ├── mars.jpg      # 火星纹理 (实习经历)
│   ├── jupiter.jpg   # 木星纹理 (项目经历)
│   ├── neptune.jpg   # 海王星纹理 (技能)
│   └── venus.jpg     # 金星纹理 (博客)
└── space/            # 空间环境纹理 (可选)
    ├── starfield.jpg # 星空背景
    └── nebula.jpg    # 星云效果
```

## 🎨 纹理要求

### 星球纹理
- **格式**: JPG, PNG, WebP
- **分辨率**: 512x256 或 1024x512 (2:1比例)
- **类型**: 球面投影全景图
- **大小**: 建议 < 2MB 每张

### 推荐素材来源
1. **NASA官方素材** - 免费真实星球纹理
   - https://www.nasa.gov/multimedia/imagegallery/
   
2. **Solar System Scope** - 高质量星球纹理
   - https://www.solarsystemscope.com/textures/
   
3. **CGTrader** - 科幻风格纹理
   - https://www.cgtrader.com/

## 🚀 如何应用纹理

1. 将纹理文件放入对应文件夹
2. 修改 `space-voyage.js` 中的星球数据
3. 添加 `texture` 字段指向文件路径

示例：
```javascript
{
    name: '关于我',
    description: '了解我的基本信息',
    position: [30, 5, -20],
    color: 0x4fc3f7,
    size: 3,
    type: 'about',
    texture: 'textures/planets/earth.jpg'  // 添加纹理路径
}
```

## 📝 命名规范

建议使用以下命名：
- `earth.jpg` - 地球 (关于我)
- `mars.jpg` - 火星 (实习经历) 
- `jupiter.jpg` - 木星 (项目经历)
- `neptune.jpg` - 海王星 (技能)
- `venus.jpg` - 金星 (博客)

## 🔧 性能优化

- 使用WebP格式可减小文件大小
- 压缩图片保持质量与性能平衡
- 考虑使用纹理LOD（细节层次）

---

**注意**: 确保所有纹理文件具有合适的版权许可！ 