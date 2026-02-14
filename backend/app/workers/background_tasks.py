from celery import Celery
from app.core.config import settings

redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/0"

celery_app = Celery("learnivo", broker=redis_url, backend=redis_url)

@celery_app.task
def generate_visual_task(content: str):
    # This logic belongs in visual_worker but celery needs the task decorator here or import it
    from app.workers.visual_worker import VisualWorker
    return VisualWorker.process(content)

@celery_app.task
def run_simulation_task(params: dict):
    from app.workers.simulation_worker import SimulationWorker
    return SimulationWorker.run(params)
