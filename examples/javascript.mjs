const baseURL = process.env.MAOLAO_BASE_URL || "https://maolaoapi.com";
const apiKey = process.env.MAOLAO_API_KEY;

if (!apiKey) {
  throw new Error("请先设置 MAOLAO_API_KEY 环境变量");
}

const response = await fetch(`${baseURL}/v1/images/tasks`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: process.env.MAOLAO_IMAGE_MODEL || "gpt-image-2",
    prompt:
      process.argv.slice(2).join(" ") || "一只坐在月球上的橘猫，电影级光影",
    n: 1,
    size: "1024x1024",
    quality: "high",
    response_format: "b64_json",
  }),
});

if (!response.ok) throw new Error(await response.text());

const submitted = await response.json();
console.log(`任务已提交：${submitted.task_id}`);

while (true) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const query = await fetch(
    `${baseURL}/v1/images/tasks/${encodeURIComponent(submitted.task_id)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  );

  if (!query.ok) throw new Error(await query.text());
  const task = await query.json();
  console.log(`当前状态：${task.status} ${task.progress || ""}`);

  if (task.status === "succeeded") {
    console.log(JSON.stringify(task.result, null, 2));
    break;
  }
  if (task.status === "failed")
    throw new Error(task.error || "图片任务执行失败");
}
