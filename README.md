# MaolaoAPI 开发者文档

MaolaoAPI 的公开 API 调用文档与示例代码。

当前收录：

- `POST /v1/images/tasks`：提交异步图片生成或编辑任务
- `GET /v1/images/tasks/{task_id}`：查询任务状态与结果
- `GET /v1/images/tasks/{task_id}/content/{index}`：获取受保护的图片正文

异步任务请求多张图片时，调用方应以
`result.data.length` 判断实际交付数量。固定按张计费会按实际可交付数量结算，
且不超过请求的 `n`；没有可交付图片时进入失败、重试或退款流程。

## 在线文档

<https://moeacgx.github.io/maolaoapi-docs/>

## 本地预览

该站点没有构建依赖，可直接使用任意静态文件服务器：

```bash
python -m http.server --directory site 8080
```

然后访问 <http://localhost:8080>。

## 示例

示例代码通过环境变量读取凭据，不要把真实 API Key 提交到仓库。

### JavaScript（Node.js 18+）

```bash
MAOLAO_API_KEY=sk-xxx node examples/javascript.mjs "一只坐在月球上的橘猫"
```

### Python 3

```bash
MAOLAO_API_KEY=sk-xxx python examples/python.py "一只坐在月球上的橘猫"
```

### cURL

```bash
MAOLAO_API_KEY=sk-xxx sh examples/curl.sh
```
