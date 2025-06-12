from fastapi import FastAPI, APIRouter, status, Request, Body, HTTPException
from fastapi.responses import JSONResponse
from models.ProjectModel import ProjectModel
from models import ResponseSignal
from pydantic import BaseModel
from typing import Optional

class ProjectNameUpdate(BaseModel):
    name: str

class ProjectCreate(BaseModel):
    name: Optional[str] = None

projects_router = APIRouter(
    prefix="/api/v1/projects",
    tags=["api_v1", "projects"],
)

@projects_router.get("/")
async def get_all_projects(request: Request):
    """
    Get all projects with their names
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    projects, _ = await project_model.get_all_projects(
        page=1,
        page_size=1000  # Assuming we won't have thousands of projects
    )

    project_list = [{"id": project.project_id, "name": project.name} for project in projects]

    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "projects": project_list
        }
    )

# Handle both with and without trailing slash
@projects_router.post("/")
@projects_router.post("")
async def create_project(request: Request, project_data: ProjectCreate = Body(...)):
    """
    Create a new project with optional name
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )
    
    # Create a new project with auto-generated ID and provided name
    from models.db_schemes import Project
    new_project = Project(name=project_data.name) if project_data.name else Project()
    
    created_project = await project_model.create_project(project=new_project)
    
    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "project": {
                "id": created_project.project_id,
                "name": created_project.name
            }
        }
    )

@projects_router.get("/{project_id}")
async def get_project(request: Request, project_id: int):
    """
    Get project details by ID
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )
    
    project = await project_model.get_project_by_id(project_id=project_id)
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "project": {
                "id": project.project_id,
                "name": project.name
            }
        }
    )

@projects_router.put("/{project_id}/name")
async def update_project_name(
    request: Request, 
    project_id: int, 
    project_data: ProjectNameUpdate = Body(...)
):
    """
    Update project name
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )
    
    updated_project = await project_model.update_project_name(
        project_id=project_id,
        name=project_data.name
    )
    
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "project": {
                "id": updated_project.project_id,
                "name": updated_project.name
            }
        }
    ) 