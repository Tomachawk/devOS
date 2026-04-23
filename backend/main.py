from __future__ import annotations
import shutil
from collections import deque
from time import time
from typing import Any

import psutil
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    import GPUtil
except ImportError:
    GPUtil = None  # type: ignore[assignment]


app = FastAPI(title="DevOS Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

history = deque(maxlen=30)
last_counters = psutil.net_io_counters()
last_time = time()


def bytes_to_gb(value: int) -> float:
    return round(value / (1024 ** 3), 2)


def get_network_speed() -> dict[str, float]:
    global last_counters, last_time

    current_counters = psutil.net_io_counters()
    current_time = time()

    elapsed = current_time - last_time
    if elapsed <= 0:
        elapsed = 1

    bytes_sent_per_sec = (current_counters.bytes_sent - last_counters.bytes_sent) / elapsed
    bytes_recv_per_sec = (current_counters.bytes_recv - last_counters.bytes_recv) / elapsed

    upload_mbps = (bytes_sent_per_sec * 8) / 1_000_000
    download_mbps = (bytes_recv_per_sec * 8) / 1_000_000

    last_counters = current_counters
    last_time = current_time

    return {
        "download": round(download_mbps, 2),
        "upload": round(upload_mbps, 2),
    }


def get_network_data() -> dict[str, Any]:
    speeds = get_network_speed()

    history.append(
        {
            "download": speeds["download"],
            "upload": speeds["upload"],
        }
    )

    counters = psutil.net_io_counters()

    return {
        "current": speeds,
        "history": list(history),
        "total_sent_mb": round(counters.bytes_sent / (1024 ** 2), 2),
        "total_recv_mb": round(counters.bytes_recv / (1024 ** 2), 2),
    }


def get_cpu_data() -> dict[str, Any]:
    usage_percent = psutil.cpu_percent(interval=0.5)
    physical_cores = psutil.cpu_count(logical=False)
    logical_cores = psutil.cpu_count(logical=True)

    return {
        "usage_percent": round(usage_percent, 2),
        "physical_cores": physical_cores,
        "logical_cores": logical_cores,
    }


def get_ram_data() -> dict[str, Any]:
    memory = psutil.virtual_memory()

    return {
        "used_gb": bytes_to_gb(memory.used),
        "total_gb": bytes_to_gb(memory.total),
        "available_gb": bytes_to_gb(memory.available),
        "usage_percent": round(memory.percent, 2),
    }


def get_storage_data() -> dict[str, Any]:
    disk = psutil.disk_usage("/")

    return {
        "used_gb": bytes_to_gb(disk.used),
        "total_gb": bytes_to_gb(disk.total),
        "free_gb": bytes_to_gb(disk.free),
        "usage_percent": round(disk.percent, 2),
    }


def get_gpu_data() -> dict[str, Any] | None:
    nvidia_smi_path = shutil.which("nvidia-smi")

    try:
        if nvidia_smi_path:
            result = subprocess.run(
                [
                    nvidia_smi_path,
                    "--query-gpu=name,utilization.gpu,memory.used,memory.total,temperature.gpu",
                    "--format=csv,noheader,nounits",
                ],
                capture_output=True,
                text=True,
                check=True,
            )

            lines = result.stdout.strip().splitlines()

            if lines:
                parts = [part.strip() for part in lines[0].split(",")]

                if len(parts) >= 5:
                    name = parts[0]
                    usage_percent = float(parts[1])
                    memory_used_mb = float(parts[2])
                    memory_total_mb = float(parts[3])
                    temperature_c = float(parts[4])

                    return {
                        "name": name,
                        "usage_percent": round(usage_percent, 2),
                        "memory_used_mb": round(memory_used_mb, 2),
                        "memory_total_mb": round(memory_total_mb, 2),
                        "memory_usage_percent": round(
                            (memory_used_mb / memory_total_mb) * 100, 2
                        ) if memory_total_mb else 0,
                        "temperature_c": round(temperature_c, 2),
                    }
    except Exception as e:
        print("GPU NVIDIA-SMI ERROR:", e)

    if GPUtil is None:
        return None

    try:
        gpus = GPUtil.getGPUs()
        if not gpus:
            return None

        gpu = gpus[0]

        return {
            "name": gpu.name,
            "usage_percent": round(gpu.load * 100, 2),
            "memory_used_mb": round(float(gpu.memoryUsed), 2),
            "memory_total_mb": round(float(gpu.memoryTotal), 2),
            "memory_usage_percent": round(
                (gpu.memoryUsed / gpu.memoryTotal) * 100, 2
            ) if gpu.memoryTotal else 0,
            "temperature_c": round(float(gpu.temperature), 2),
        }
    except Exception as e:
        print("GPU GPUTIL ERROR:", e)
        return None


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "DevOS backend is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/system/stats")
def system_stats() -> dict[str, Any]:
    cpu = get_cpu_data()
    gpu = get_gpu_data()
    ram = get_ram_data()
    storage = get_storage_data()
    network = get_network_data()

    return {
        "cpu": cpu,
        "gpu": gpu,
        "ram": ram,
        "storage": storage,
        "network": network,
    }