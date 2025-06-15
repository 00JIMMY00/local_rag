import httpx
from typing import List, Dict, Any, Optional, Union
import json
import logging
from ..LLMInterface import LLMInterface
from ..LLMEnums import OpenAIEnums
import requests

class OllamaProvider(LLMInterface):
    def __init__(
        self,
        api_url: str,
        default_input_max_characters: int = 1024,
        default_generation_max_output_tokens: int = 200,
        default_generation_temperature: float = 0.1,
    ):
        self.api_url = api_url
        self.default_input_max_characters = default_input_max_characters
        self.default_generation_max_output_tokens = default_generation_max_output_tokens
        self.default_generation_temperature = default_generation_temperature
        self.embedding_model_id = None
        self.embedding_size = None
        self.generation_model_id = None
        self.logger = logging.getLogger(__name__)
        self.enums = OpenAIEnums  # Using OpenAI's enum format for roles

    def set_embedding_model(self, model_id: str, embedding_size: int):
        self.embedding_model_id = model_id
        self.embedding_size = embedding_size

    def set_generation_model(self, model_id: str):
        self.generation_model_id = model_id
        
    def process_text(self, text: str):
        return text[:self.default_input_max_characters].strip()

    def generate_embedding_sync(self, text: str) -> List[float]:
        """Generate embeddings for text using Ollama API - synchronous version"""
        if not self.embedding_model_id:
            self.logger.error("Embedding model not set")
            return None

        try:
            response = requests.post(
                f"{self.api_url}/api/embeddings",
                json={
                    "model": self.embedding_model_id,
                    "prompt": text
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                self.logger.error(f"Error from Ollama API: {response.text}")
                return None
            
            result = response.json()
            return result["embedding"]
        except Exception as e:
            self.logger.error(f"Error generating embeddings: {str(e)}")
            return None
            
    def embed_text(self, text: Union[str, List[str]], document_type: str = None) -> List[List[float]]:
        """
        Generate embeddings for one or more texts using synchronous requests
        """
        if not self.embedding_model_id:
            self.logger.error("Embedding model was not set")
            return None
            
        if isinstance(text, str):
            text = [text]
            
        # Process the texts to ensure they're within length limits
        processed_texts = [self.process_text(t) for t in text]
        
        try:
            results = []
            for t in processed_texts:
                result = self.generate_embedding_sync(t)
                if result:
                    results.append(result)
                else:
                    self.logger.error(f"Failed to generate embedding for text: {t[:50]}...")
                    return None
            
            return results
        except Exception as e:
            self.logger.error(f"Error in embed_text: {str(e)}")
            return None

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embeddings for text using Ollama API - async version"""
        if not self.embedding_model_id:
            raise ValueError("Embedding model not set")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/api/embeddings",
                    json={
                        "model": self.embedding_model_id,
                        "prompt": text
                    },
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    raise Exception(f"Error from Ollama API: {response.text}")
                
                result = response.json()
                return result["embedding"]
        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            raise

    def generate_text(self, prompt: str, chat_history: list=[], max_output_tokens: int=None,
                      temperature: float = None) -> str:
        """Generate text using Ollama API in a synchronous way"""
        import asyncio
        
        if not self.generation_model_id:
            self.logger.error("Generation model not set")
            return None
            
        max_output_tokens = max_output_tokens if max_output_tokens else self.default_generation_max_output_tokens
        temperature = temperature if temperature else self.default_generation_temperature
        
        # Prepare the prompt with chat history if provided
        full_prompt = prompt
        if chat_history and len(chat_history) > 0:
            # Format chat history for Ollama
            formatted_history = ""
            for msg in chat_history:
                if msg["role"] == self.enums.SYSTEM.value:
                    formatted_history += f"System: {msg['text']}\n\n"
                elif msg["role"] == self.enums.USER.value:
                    formatted_history += f"User: {msg['text']}\n\n"
                elif msg["role"] == self.enums.ASSISTANT.value:
                    formatted_history += f"Assistant: {msg['text']}\n\n"
            
            full_prompt = formatted_history + "User: " + prompt
        
        try:
            response = requests.post(
                f"{self.api_url}/api/generate",
                json={
                    "model": self.generation_model_id,
                    "prompt": full_prompt,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_output_tokens
                    },
                    "stream": False
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                self.logger.error(f"Error from Ollama API: {response.text}")
                return None
            
            result = response.json()
            return result["response"]
        except Exception as e:
            self.logger.error(f"Error in generate_text: {str(e)}")
            return None
            
    async def _async_generate_text(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Async implementation of text generation"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/api/generate",
                    json={
                        "model": self.generation_model_id,
                        "prompt": prompt,
                        "options": {
                            "temperature": temperature,
                            "num_predict": max_tokens
                        },
                        "stream": False
                    },
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    raise Exception(f"Error from Ollama API: {response.text}")
                
                result = response.json()
                return result["response"]
        except Exception as e:
            self.logger.error(f"Error generating text: {str(e)}")
            raise
            
    def construct_prompt(self, prompt: str, role: str):
        return {
            "role": role,
            "text": prompt,
        } 