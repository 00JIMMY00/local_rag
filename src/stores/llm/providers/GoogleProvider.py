from ..LLMInterface import LLMInterface
from ..LLMEnums import GoogleEnums
import requests
import json
import logging
from typing import List, Union

class GoogleProvider(LLMInterface):

    def __init__(self, api_key: str, api_url: str=None,
                       default_input_max_characters: int=1000,
                       default_generation_max_output_tokens: int=1000,
                       default_generation_temperature: float=0.1):
        
        self.api_key = api_key
        self.api_url = api_url

        self.default_input_max_characters = default_input_max_characters
        self.default_generation_max_output_tokens = default_generation_max_output_tokens
        self.default_generation_temperature = default_generation_temperature

        self.generation_model_id = None

        self.embedding_model_id = None
        self.embedding_size = None

        self.enums = GoogleEnums
        self.logger = logging.getLogger(__name__)

    def set_generation_model(self, model_id: str):
        self.generation_model_id = model_id

    def set_embedding_model(self, model_id: str, embedding_size: int):
        self.embedding_model_id = model_id
        self.embedding_size = embedding_size

    def process_text(self, text: str):
        return text[:self.default_input_max_characters].strip()

    def generate_text(self, prompt: str, chat_history: list=[], max_output_tokens: int=None,
                            temperature: float = None):
        
        if not self.generation_model_id:
            self.logger.error("Generation model for Google was not set")
            return None
        
        max_output_tokens = max_output_tokens if max_output_tokens else self.default_generation_max_output_tokens
        temperature = temperature if temperature else self.default_generation_temperature

        # Format chat history for Google's API
        formatted_history = []
        system_message = None
        
        # First, extract any system message and handle other messages
        for message in chat_history:
            if message["role"].lower() == "system":
                # Save system message to prepend to first user message
                system_message = message["content"]
            else:
                # For non-system messages, add them normally
                formatted_history.append({
                    "role": message["role"] if message["role"].lower() != "assistant" else "model",
                    "parts": [{"text": message["content"]}]
                })
        
        # Prepare the current prompt, potentially with system message
        current_prompt = prompt
        if system_message and len(formatted_history) == 0:
            # If there's a system message and no prior history, prepend it to the user message
            current_prompt = f"Instructions: {system_message}\n\nUser query: {prompt}"
        
        # Add the current prompt
        formatted_history.append({
            "role": GoogleEnums.USER.value,
            "parts": [{"text": current_prompt}]
        })
        
        # Prepare the request payload
        payload = {
            "contents": formatted_history,
            "generationConfig": {
                "maxOutputTokens": max_output_tokens,
                "temperature": temperature
            }
        }
        
        # Make API request
        url = f"{self.api_url}/models/{self.generation_model_id}:generateContent?key={self.api_key}"
        
        try:
            print(f"Calling Gemini API with URL: {url}")
            print(f"Payload: {json.dumps(payload, indent=2)}")
            response = requests.post(url, json=payload)
            
            if not response.ok:
                print(f"Gemini API error status: {response.status_code}")
                print(f"Gemini API error response: {response.text}")
                
            response.raise_for_status()
            
            response_data = response.json()
            print(f"Gemini API response: {json.dumps(response_data, indent=2)}")
            
            if not response_data or "candidates" not in response_data or len(response_data["candidates"]) == 0:
                self.logger.error("Error while generating text with Google Gemini")
                return None
                
            return response_data["candidates"][0]["content"]["parts"][0]["text"]
            
        except Exception as e:
            self.logger.error(f"Error calling Google Gemini API: {str(e)}")
            return None

    def embed_text(self, text: Union[str, List[str]], document_type: str = None):
        # Google Gemini doesn't support embeddings yet, so we'll return None
        # In a real implementation, you might want to use a different provider for embeddings
        self.logger.error("Embedding not supported by Google Gemini provider")
        return None

    def construct_prompt(self, prompt: str, role: str):
        # For Google, we need to handle the system role differently
        if role.lower() == "system":
            # We'll handle system messages in generate_text
            role = "user"
            
        return {
            "role": role,
            "content": prompt,
        } 