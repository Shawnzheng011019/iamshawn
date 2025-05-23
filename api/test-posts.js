export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 尝试直接访问posts.json文件
    const response = await fetch('https://iamshawn.vercel.app/posts/posts.json');
    
    if (response.ok) {
      const data = await response.json();
      res.status(200).json({
        success: true,
        message: 'posts.json可以通过URL访问',
        url: 'https://iamshawn.vercel.app/posts/posts.json',
        dataCount: data.length,
        data: data
      });
    } else {
      // 尝试访问Gitee镜像
      const giteeResponse = await fetch('https://gitee.com/Shawnzheng011019/iamshawn/raw/master/posts/posts.json');
      
      if (giteeResponse.ok) {
        const giteeData = await giteeResponse.json();
        res.status(200).json({
          success: true,
          message: 'posts.json可以通过Gitee镜像访问',
          url: 'https://gitee.com/Shawnzheng011019/iamshawn/raw/master/posts/posts.json',
          dataCount: giteeData.length,
          data: giteeData
        });
      } else {
        res.status(404).json({
          success: false,
          message: '无法从任何源访问posts.json',
          vercelStatus: response.status,
          giteeStatus: giteeResponse.status
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API错误',
      error: error.message
    });
  }
} 