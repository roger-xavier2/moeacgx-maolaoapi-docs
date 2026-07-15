import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


BASE_URL = os.getenv("MAOLAO_BASE_URL", "https://maolaoapi.com").rstrip("/")
API_KEY = os.getenv("MAOLAO_API_KEY")

if not API_KEY:
    raise RuntimeError("请先设置 MAOLAO_API_KEY 环境变量")


def request_json(url, method="GET", payload=None):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8") if payload else None
    request = urllib.request.Request(
        url,
        data=body,
        method=method,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        raise RuntimeError(error.read().decode("utf-8")) from error


prompt = " ".join(sys.argv[1:]) or "一只坐在月球上的橘猫，电影级光影"
submitted = request_json(
    f"{BASE_URL}/v1/images/tasks",
    method="POST",
    payload={
        "model": os.getenv("MAOLAO_IMAGE_MODEL", "gpt-image-2"),
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "high",
        "response_format": "b64_json",
    },
)

task_id = submitted["task_id"]
print(f"任务已提交：{task_id}")

while True:
    time.sleep(3)
    task = request_json(f"{BASE_URL}/v1/images/tasks/{urllib.parse.quote(task_id)}")
    print(f"当前状态：{task['status']} {task.get('progress', '')}")

    if task["status"] == "succeeded":
        print(json.dumps(task["result"], ensure_ascii=False, indent=2))
        break
    if task["status"] == "failed":
        raise RuntimeError(task.get("error", "图片任务执行失败"))
