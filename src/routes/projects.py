from fastapi import FastAPI, APIRouter, status, Request
from fastapi.responses import JSONResponse
from models.ProjectModel import ProjectModel
from models import ResponseSignal

projects_router = APIRouter(
    prefix="/api/v1/projects",
    tags=["api_v1", "projects"],
)

@projects_router.get("/")
async def get_all_projects(request: Request):
    """
    Get all project IDs
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    projects, _ = await project_model.get_all_projects(
        page=1,
        page_size=1000  # Assuming we won't have thousands of projects
    )

    project_ids = [project.project_id for project in projects]

    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "projects": project_ids
        }
    ) 