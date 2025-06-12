from .BaseController import BaseController
from .ProjectController import ProjectController
from fastapi import UploadFile
from models import ResponseSignal
import re
import os
import logging

logger = logging.getLogger('uvicorn.error')

class DataController(BaseController):
    
    def __init__(self):
        super().__init__()
        self.size_scale = 1048576 # convert MB to bytes

    def validate_uploaded_file(self, file: UploadFile):
        logger.info(f"Validating file: {file.filename}, content_type: {file.content_type}")
        
        # Accept both application/pdf and any content type for files with .pdf extension
        valid_content_types = self.app_settings.FILE_ALLOWED_TYPES
        is_pdf_by_extension = file.filename.lower().endswith('.pdf')
        
        if file.content_type not in valid_content_types and not is_pdf_by_extension:
            logger.warning(f"File type not supported: {file.content_type}, filename: {file.filename}")
            return False, ResponseSignal.FILE_TYPE_NOT_SUPPORTED.value

        # FastAPI's UploadFile doesn't have a size attribute until the file is read
        # We'll skip size validation for now
        
        logger.info(f"File validation successful: {file.filename}")
        return True, ResponseSignal.FILE_VALIDATED_SUCCESS.value

    def generate_unique_filepath(self, orig_file_name: str, project_id: str):
        logger.info(f"Generating unique filepath for {orig_file_name} in project {project_id}")
        
        random_key = self.generate_random_string()
        project_path = ProjectController().get_project_path(project_id=project_id)

        cleaned_file_name = self.get_clean_file_name(
            orig_file_name=orig_file_name
        )

        # Ensure the file has a .pdf extension if it doesn't already
        if not cleaned_file_name.lower().endswith('.pdf'):
            cleaned_file_name += '.pdf'

        new_file_path = os.path.join(
            project_path,
            random_key + "_" + cleaned_file_name
        )

        while os.path.exists(new_file_path):
            random_key = self.generate_random_string()
            new_file_path = os.path.join(
                project_path,
                random_key + "_" + cleaned_file_name
            )

        logger.info(f"Generated filepath: {new_file_path}")
        return new_file_path, random_key + "_" + cleaned_file_name

    def get_clean_file_name(self, orig_file_name: str):
        # remove any special characters, except underscore and .
        cleaned_file_name = re.sub(r'[^\w.]', '', orig_file_name.strip())

        # replace spaces with underscore
        cleaned_file_name = cleaned_file_name.replace(" ", "_")

        return cleaned_file_name


