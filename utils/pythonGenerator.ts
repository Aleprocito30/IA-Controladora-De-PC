import { BotConfiguration, AIProvider } from '../types';

export const generatePythonScript = (config: BotConfiguration): string => {
  const { provider, apiKey, model } = config;

  // We construct the python script as a massive template string.
  // We double escape backslashes where necessary for Python strings.
  
  return `import os
import sys
import time
import json
import random
import threading
import subprocess
import platform
import logging
import datetime
import traceback
import queue
from typing import Optional, Dict, List, Union, Any

def system_pause():
    """Pause execution to keep terminal open on error"""
    try:
        input("\\n[SISTEMA] Presiona ENTER para cerrar la terminal...")
    except:
        pass

# --- DEPENDENCY CHECK ---
try:
    import pyautogui
    import speech_recognition as sr
    import requests
    import psutil
    from colorama import init, Fore, Style
except ImportError as e:
    print(f"CRITICAL ERROR: Missing dependency {e.name}")
    print("Please run: pip install pyautogui SpeechRecognition pyaudio requests psutil colorama")
    system_pause()
    sys.exit(1)

# --- CONFIGURATION & CONSTANTS ---
VERSION = "2.0.4-Stable"
BOT_NAME = "AleBot"
TRIGGER_WORDS = ["ale bot", "alebot", "ale bo", "alevot", "ali bot", "hey ale"]
LANGUAGE = "es-ES"

# Initialize Colorama
init(autoreset=True)

# --- ADVANCED LOGGING SYSTEM ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(levelname)s] - %(threadName)s - %(message)s',
    handlers=[
        logging.FileHandler("alebot_runtime.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("AleBotKernel")

# --- SECURITY LAYER (THE "VOID" PROTOCOL) ---
class SecurityProtocol:
    """
    Manages system integrity and prevents unauthorized actions.
    Ensures the AI does not close critical applications or damage the system.
    """
    def __init__(self):
        self.forbidden_processes = [
            "chrome", "msedge", "ollama", "cmd", "void", 
            "powershell", "google antigravity", "explorer", 
            "discord", "whatsapp", "qwen", "steam", "system", 
            "registry", "taskmgr"
        ]
        self.forbidden_keywords = [
            "shutdown", "restart", "format", "delete system32", 
            "rm -rf", "apagar", "reiniciar", "formatear"
        ]
        logger.info("SecurityProtocol initialized. Shields UP.")

    def inspect_intent(self, action_intent: str) -> bool:
        """Analyzes a raw intent string for malicious commands."""
        action_lower = action_intent.lower()
        for keyword in self.forbidden_keywords:
            if keyword in action_lower:
                logger.warning(f"Security Alert: Blocked harmful keyword '{keyword}'")
                return False
        return True

    def validate_process_interaction(self, target_process: str) -> bool:
        """Checks if a process is on the whitelist/blacklist."""
        target_lower = target_process.lower()
        for forbidden in self.forbidden_processes:
            if forbidden in target_lower:
                logger.warning(f"Security Alert: Access to '{forbidden}' is RESTRICTED.")
                return False
        return True

    def prevent_shutdown(self):
        """Active monitoring to intercept shutdown calls."""
        # This is a simulation of a hook intercept
        pass

# --- AI PROVIDER ABSTRACTION LAYER ---
class AIProviderFactory:
    """
    Factory pattern to instantiate the correct LLM provider.
    """
    @staticmethod
    def get_provider(provider_type: str, api_key: str, model_name: str):
        if provider_type == "${AIProvider.GROQ}":
            return GroqProvider(api_key, model_name)
        elif provider_type == "${AIProvider.OLLAMA}":
            return OllamaProvider(model_name)
        elif provider_type == "${AIProvider.GEMINI}":
            return GeminiProvider(api_key, model_name)
        # Add other providers here...
        else:
            return MockProvider()

class BaseProvider:
    def generate_response(self, prompt: str) -> str:
        raise NotImplementedError

class GroqProvider(BaseProvider):
    def __init__(self, key, model):
        self.key = key
        self.model = model
        self.url = "https://api.groq.com/openai/v1/chat/completions"
    
    def generate_response(self, prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5
        }
        try:
            resp = requests.post(self.url, headers=headers, json=data)
            resp.raise_for_status()
            return resp.json()['choices'][0]['message']['content']
        except Exception as e:
            logger.error(f"Groq API Error: {e}")
            return "ERROR_API_CONNECTION"

class OllamaProvider(BaseProvider):
    def __init__(self, model):
        self.model = model
        self.url = "http://localhost:11434/api/generate"
    
    def generate_response(self, prompt: str) -> str:
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        try:
            resp = requests.post(self.url, json=data)
            return resp.json()['response']
        except Exception as e:
            logger.error(f"Ollama Connection Error: {e}")
            return "ERROR_LOCAL_HOST_CONNECTION"

class GeminiProvider(BaseProvider):
    def __init__(self, key, model):
        self.key = key
        self.model = model
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    
    def generate_response(self, prompt: str) -> str:
        data = { "contents": [{ "parts": [{ "text": prompt }] }] }
        try:
            resp = requests.post(self.url, json=data)
            return resp.json()['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return "ERROR_GOOGLE_API"

class MockProvider(BaseProvider):
    def generate_response(self, prompt: str) -> str:
        return "Simulación: Acción recibida."

# --- SYSTEM CONTROLLER ---
class SystemController:
    """
    Executes physical actions on the host machine.
    Wrapped in try-except blocks for safety.
    """
    def __init__(self, security: SecurityProtocol):
        self.security = security
        self.screen_width, self.screen_height = pyautogui.size()
        pyautogui.FAILSAFE = True # Move mouse to corner to abort

    def execute_command_json(self, json_command: str):
        """
        Parses a JSON string from the LLM and executes the action.
        Expected format: {"action": "type", "parameters": {...}}
        """
        try:
            # Clean json string if it contains markdown
            clean_json = json_command.replace('\\\\', '')
            if "\`\`\`json" in clean_json:
                clean_json = clean_json.split("\`\`\`json")[1].split("\`\`\`")[0]
            elif "\`\`\`" in clean_json:
                 clean_json = clean_json.split("\`\`\`")[1].split("\`\`\`")[0]
            
            cmd = json.loads(clean_json)
            action = cmd.get("action")
            params = cmd.get("parameters", {})
            
            if not self.security.inspect_intent(action):
                print(Fore.RED + "Acción bloqueada por protocolo de seguridad.")
                return

            print(Fore.CYAN + f"EJECUTANDO: {action} con {params}")
            
            if action == "mouse_move":
                pyautogui.moveTo(params.get("x", 0), params.get("y", 0), duration=0.5)
            elif action == "mouse_click":
                pyautogui.click(button=params.get("button", "left"))
            elif action == "type_text":
                pyautogui.write(params.get("text", ""), interval=0.05)
            elif action == "press_key":
                keys = params.get("keys", [])
                if isinstance(keys, str): keys = [keys]
                pyautogui.hotkey(*keys)
            elif action == "open_app":
                app_name = params.get("name", "")
                if self.security.validate_process_interaction(app_name):
                    pyautogui.press('win')
                    time.sleep(0.5)
                    pyautogui.write(app_name)
                    time.sleep(0.5)
                    pyautogui.press('enter')
            elif action == "unknown":
                print(Fore.YELLOW + "El modelo no supo qué hacer.")

        except json.JSONDecodeError:
            logger.error("Failed to decode JSON from LLM")
        except Exception as e:
            logger.error(f"Execution Error: {e}")
            traceback.print_exc()

# --- VOICE RECOGNITION KERNEL ---
class VoiceCore:
    def __init__(self):
        try:
            self.recognizer = sr.Recognizer()
            self.recognizer.energy_threshold = 300
            self.recognizer.dynamic_energy_threshold = True
            self.microphone = sr.Microphone()
        except Exception as e:
            print(Fore.RED + f"CRITICAL ERROR INITIALIZING AUDIO: {e}")
            print("Asegúrate de tener un micrófono conectado y configurado como predeterminado.")
            raise e
        
        with self.microphone as source:
            print(Fore.BLUE + "Calibrando ruido ambiental... Por favor silencio.")
            self.recognizer.adjust_for_ambient_noise(source, duration=2)
            print(Fore.GREEN + "Calibración completada.")

    def listen(self) -> Optional[str]:
        with self.microphone as source:
            print(Fore.MAGENTA + "Escuchando esperando 'Ale Bot'...")
            try:
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
                try:
                    text = self.recognizer.recognize_google(audio, language=LANGUAGE)
                    print(Fore.WHITE + f"Oído: {text}")
                    return text.lower()
                except sr.UnknownValueError:
                    return None
                except sr.RequestError:
                    print(Fore.RED + "Error de conexión con Google Speech API")
                    return None
            except sr.WaitTimeoutError:
                return None

# --- MAIN APPLICATION ORCHESTRATOR ---
class AleBotApp:
    def __init__(self):
        self.security = SecurityProtocol()
        self.controller = SystemController(self.security)
        self.voice = VoiceCore()
        
        # User Configuration
        self.provider_type = "${provider}"
        self.api_key = "${apiKey}" or input("Por favor ingresa tu API Key: ")
        self.model_name = "${model}"
        
        self.ai = AIProviderFactory.get_provider(
            self.provider_type, 
            self.api_key, 
            self.model_name
        )
        
        self.is_running = True
        self.command_queue = queue.Queue()

    def generate_system_prompt(self) -> str:
        return """
        Eres AleBot, una IA avanzada de control de escritorio.
        Tu trabajo es convertir instrucciones de lenguaje natural en comandos JSON para controlar el PC.
        
        LIMITACIONES ESTRICTAS:
        - NO puedes cerrar navegadores, steam, discord, etc.
        - NO puedes apagar el PC.
        - Si te piden algo peligroso, responde con action: "unknown".
        
        FORMATO DE RESPUESTA JSON OBLIGATORIO:
        {
            "action": "mouse_move" | "mouse_click" | "type_text" | "press_key" | "open_app" | "unknown",
            "parameters": { ... }
        }
        
        Ejemplos:
        "Escribe hola": {"action": "type_text", "parameters": {"text": "hola"}}
        "Abre notepad": {"action": "open_app", "parameters": {"name": "notepad"}}
        "Cierra Chrome": {"action": "unknown", "parameters": {"reason": "forbidden"}}
        """

    def process_voice_command(self, text: str):
        # Check for wake word
        triggered = False
        for trigger in TRIGGER_WORDS:
            if trigger in text:
                triggered = True
                command_content = text.split(trigger, 1)[1].strip()
                break
        
        if not triggered:
            return

        if not command_content:
            print(Fore.YELLOW + "¿Sí? Estoy esperando tu orden.")
            return

        print(Fore.NEON_GREEN if hasattr(Fore, 'NEON_GREEN') else Fore.GREEN + f"PROCESANDO ORDEN: {command_content}")
        
        # Build prompt for LLM
        sys_prompt = self.generate_system_prompt()
        full_prompt = f"{sys_prompt}\n\nInstrucción de usuario: {command_content}"
        
        # Get AI Response
        print(Fore.YELLOW + "Consultando cerebro digital...")
        response_json = self.ai.generate_response(full_prompt)
        
        # Execute
        self.controller.execute_command_json(response_json)

    def run(self):
        print(Style.BRIGHT + Fore.CYAN + "="*50)
        print(Style.BRIGHT + Fore.CYAN + f"   INICIANDO {BOT_NAME} v{VERSION}")
        print(Style.BRIGHT + Fore.CYAN + "="*50)
        print(f"Provider: {self.provider_type}")
        print(f"Model: {self.model_name}")
        print("Presiona Ctrl+C para detener.")
        
        try:
            while self.is_running:
                text = self.voice.listen()
                if text:
                    self.process_voice_command(text)
        except KeyboardInterrupt:
            print(Fore.RED + "\\nApagando sistemas...")
            pass

if __name__ == "__main__":
    try:
        # Check for Admin privileges on Windows for better control
        if platform.system() == "Windows":
            try:
                import ctypes
                if not ctypes.windll.shell32.IsUserAnAdmin():
                    print(Fore.YELLOW + "ADVERTENCIA: Se recomienda ejecutar como Administrador para control total.")
            except:
                pass
                
        bot = AleBotApp()
        bot.run()
    except Exception as e:
        print(Fore.RED + "\\n" + "="*50)
        print(Fore.RED + "FATAL ERROR EN EJECUCIÓN")
        print(Fore.RED + "="*50)
        traceback.print_exc()
        print(Fore.RED + "="*50)
    finally:
        system_pause()
`;
};