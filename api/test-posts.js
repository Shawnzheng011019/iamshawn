import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // 尝试读取posts.json文件
    const postsPath = path.join(process.cwd(), 'posts', 'posts.json');
    console.log('尝试读取文件路径:', postsPath);
    
    if (fs.existsSync(postsPath)) {
      const postsContent = fs.readFileSync(postsPath, 'utf8');
      res.status(200).json({
        success: true,
        message: 'posts.json文件存在并可读取',
        filePath: postsPath,
        contentLength: postsContent.length,
        data: JSON.parse(postsContent)
      });
    } else {
      // 列出posts目录内容
      const postsDir = path.join(process.cwd(), 'posts');
      let dirContents = [];
      if (fs.existsSync(postsDir)) {
        dirContents = fs.readdirSync(postsDir);
      }
      
      res.status(404).json({
        success: false,
        message: 'posts.json文件不存在',
        filePath: postsPath,
        postsDir,
        dirContents
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API错误',
      error: error.message,
      stack: error.stack
    });
  }
} 