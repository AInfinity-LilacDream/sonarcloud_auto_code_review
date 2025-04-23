const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5928;

// 使用 CORS 中间件，允许前端跨域访问
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 定义一个 POST 接口，用于代理 OpenAI API 请求
app.post('/api/openai', async (req, res) => {
  try {
    const { prompt } = req.body; // 假设前端传递了一个 prompt 参数
    const OPENAI_API_KEY = 'ifdu'; // 替换为你的 OpenAI API 密钥

    // 调用 OpenAI API
    const response = await axios.post(
      'https://mapi.fduer.com/api/v1/chat/completions',
      {
        model: 'deepseek-r1-671b-turbo', // 使用的模型
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 50 // 最大生成 token 数量
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // 将 OpenAI 的响应返回给前端
    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to call OpenAI API" });
  } 
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});