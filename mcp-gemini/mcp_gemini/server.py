#!/usr/bin/env python3
"""
Claude-Gemini MCP Server
Enables Claude Code to collaborate with Google's Gemini AI
"""

import json
import sys
import os
import logging
from typing import Dict, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger(__name__)

# Ensure unbuffered output
sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 1)
sys.stderr = os.fdopen(sys.stderr.fileno(), 'w', 1)

# Server version
__version__ = "1.1.0"

# Initialize Gemini
try:
    import google.generativeai as genai
    logger.info("Attempting to initialize Gemini...")
    
    # Get API key from environment - no fallback to prevent security issues
    API_KEY = os.environ.get("GEMINI_API_KEY")
    if not API_KEY:
        logger.error("GEMINI_API_KEY environment variable not found")
        print(json.dumps({
            "jsonrpc": "2.0",
            "error": {
                "code": -32603,
                "message": "GEMINI_API_KEY environment variable is required but not set"
            }
        }), file=sys.stdout, flush=True)
        sys.exit(1)
    
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    GEMINI_AVAILABLE = True
    logger.info("Gemini initialized successfully")
except ImportError as e:
    GEMINI_AVAILABLE = False
    GEMINI_ERROR = f"Failed to import google.generativeai: {str(e)}"
    logger.error(f"Import error: {GEMINI_ERROR}")
except Exception as e:
    GEMINI_AVAILABLE = False
    GEMINI_ERROR = f"Failed to initialize Gemini: {str(e)}"
    logger.error(f"Initialization error: {GEMINI_ERROR}")

def send_response(response: Dict[str, Any]):
    """Send a JSON-RPC response"""
    print(json.dumps(response), flush=True)

def validate_temperature(temperature: float) -> float:
    """Validate temperature parameter is within valid range"""
    try:
        temp = float(temperature)
        if not 0.0 <= temp <= 1.0:
            raise ValueError("Temperature must be between 0.0 and 1.0")
        return temp
    except (TypeError, ValueError) as e:
        raise ValueError(f"Invalid temperature value: {temperature}. {str(e)}")

def validate_string_param(param: Any, param_name: str, max_length: Optional[int] = None) -> str:
    """Validate a string parameter"""
    if not isinstance(param, str):
        raise TypeError(f"{param_name} must be a string, got {type(param).__name__}")
    
    if not param.strip():
        raise ValueError(f"{param_name} cannot be empty")
    
    if max_length and len(param) > max_length:
        raise ValueError(f"{param_name} exceeds maximum length of {max_length} characters")
    
    return param

def handle_initialize(request_id: Any) -> Dict[str, Any]:
    """Handle initialization"""
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "result": {
            "protocolVersion": "2024-11-05",
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": "claude-gemini-mcp",
                "version": __version__
            }
        }
    }

def handle_tools_list(request_id: Any) -> Dict[str, Any]:
    """List available tools"""
    tools = []
    
    if GEMINI_AVAILABLE:
        tools = [
            {
                "name": "ask_gemini",
                "description": "Ask Gemini a question and get the response directly in Claude's context",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "prompt": {
                            "type": "string",
                            "description": "The question or prompt for Gemini"
                        },
                        "temperature": {
                            "type": "number",
                            "description": "Temperature for response (0.0-1.0)",
                            "default": 0.5
                        }
                    },
                    "required": ["prompt"]
                }
            },
            {
                "name": "gemini_code_review",
                "description": "Have Gemini review code and return feedback directly to Claude",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "code": {
                            "type": "string",
                            "description": "The code to review"
                        },
                        "focus": {
                            "type": "string",
                            "description": "Specific focus area (security, performance, etc.)",
                            "default": "general"
                        }
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "gemini_brainstorm",
                "description": "Brainstorm solutions with Gemini, response visible to Claude",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "topic": {
                            "type": "string",
                            "description": "The topic to brainstorm about"
                        },
                        "context": {
                            "type": "string",
                            "description": "Additional context",
                            "default": ""
                        }
                    },
                    "required": ["topic"]
                }
            }
        ]
    else:
        tools = [
            {
                "name": "server_info",
                "description": "Get server status and error information",
                "inputSchema": {
                    "type": "object",
                    "properties": {}
                }
            }
        ]
    
    return {
        "jsonrpc": "2.0",
        "id": request_id,
        "result": {
            "tools": tools
        }
    }

def handle_server_info() -> str:
    """Handle server_info tool call"""
    if GEMINI_AVAILABLE:
        return f"Server v{__version__} - Gemini connected and ready!"
    else:
        return f"Server v{__version__} - Gemini error: {GEMINI_ERROR}"

def handle_ask_gemini(arguments: Dict[str, Any]) -> str:
    """Handle ask_gemini tool call"""
    if not GEMINI_AVAILABLE:
        return f"Gemini not available: {GEMINI_ERROR}"
    
    try:
        prompt = validate_string_param(arguments.get("prompt", ""), "prompt")
        temperature = validate_temperature(arguments.get("temperature", 0.5))
        return call_gemini(prompt, temperature)
    except (ValueError, TypeError) as e:
        return f"Parameter validation error: {str(e)}"

def handle_gemini_code_review(arguments: Dict[str, Any]) -> str:
    """Handle gemini_code_review tool call"""
    if not GEMINI_AVAILABLE:
        return f"Gemini not available: {GEMINI_ERROR}"
    
    try:
        code = validate_string_param(arguments.get("code", ""), "code", max_length=50000)
        focus = validate_string_param(arguments.get("focus", "general"), "focus", max_length=100)
        
        # Validate focus parameter against allowed values
        allowed_focus_areas = ["general", "security", "performance", "style", "bugs", "architecture"]
        if focus.lower() not in allowed_focus_areas:
            focus = "general"
        
        prompt = f"""Please review this code with a focus on {focus}:

```
{code}
```

Provide specific, actionable feedback on:
1. Potential issues or bugs
2. Security concerns
3. Performance optimizations
4. Best practices
5. Code clarity and maintainability"""
        return call_gemini(prompt, 0.2)
    except (ValueError, TypeError) as e:
        return f"Parameter validation error: {str(e)}"

def handle_gemini_brainstorm(arguments: Dict[str, Any]) -> str:
    """Handle gemini_brainstorm tool call"""
    if not GEMINI_AVAILABLE:
        return f"Gemini not available: {GEMINI_ERROR}"
    
    try:
        topic = validate_string_param(arguments.get("topic", ""), "topic", max_length=1000)
        context = arguments.get("context", "")
        if context:
            context = validate_string_param(context, "context", max_length=5000)
        
        prompt = f"Let's brainstorm about: {topic}"
        if context:
            prompt += f"\n\nContext: {context}"
        prompt += "\n\nProvide creative ideas, alternatives, and considerations."
        return call_gemini(prompt, 0.7)
    except (ValueError, TypeError) as e:
        return f"Parameter validation error: {str(e)}"

def call_gemini(prompt: str, temperature: float = 0.5) -> str:
    """Call Gemini and return response"""
    try:
        # Validate inputs
        prompt = validate_string_param(prompt, "prompt", max_length=32000)
        temperature = validate_temperature(temperature)
        
        logger.debug(f"Calling Gemini with temperature={temperature}, prompt_length={len(prompt)}")
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                max_output_tokens=8192,
            )
        )
        
        logger.info(f"Gemini response received, length={len(response.text)}")
        return response.text
    except ValueError as e:
        logger.warning(f"Validation error in call_gemini: {str(e)}")
        return f"Validation error: {str(e)}"
    except Exception as e:
        logger.error(f"Error calling Gemini: {str(e)}", exc_info=True)
        return f"Error calling Gemini: {str(e)}"

def handle_tool_call(request_id: Any, params: Dict[str, Any]) -> Dict[str, Any]:
    """Handle tool execution"""
    tool_name = params.get("name")
    arguments = params.get("arguments", {})
    
    logger.info(f"Handling tool call: {tool_name}")
    
    try:
        # Map tool names to their handler functions
        tool_handlers = {
            "server_info": lambda args: handle_server_info(),
            "ask_gemini": handle_ask_gemini,
            "gemini_code_review": handle_gemini_code_review,
            "gemini_brainstorm": handle_gemini_brainstorm
        }
        
        if tool_name not in tool_handlers:
            raise ValueError(f"Unknown tool: {tool_name}. Available tools: {', '.join(tool_handlers.keys())}")
        
        # Call the appropriate handler
        result = tool_handlers[tool_name](arguments)
        
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "result": {
                "content": [
                    {
                        "type": "text",
                        "text": f"🤖 GEMINI RESPONSE:\n\n{result}"
                    }
                ]
            }
        }
    except Exception as e:
        logger.error(f"Error in tool call {tool_name}: {str(e)}", exc_info=True)
        return {
            "jsonrpc": "2.0",
            "id": request_id,
            "error": {
                "code": -32603,
                "message": str(e)
            }
        }

def main():
    """Main server loop"""
    logger.info(f"Starting MCP Gemini server v{__version__}")
    
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            
            # Initialize request_id early to ensure it's available for error handling
            request_id = None
            
            request = json.loads(line.strip())
            method = request.get("method")
            request_id = request.get("id")
            params = request.get("params", {})
            
            logger.debug(f"Received request: method={method}, id={request_id}")
            
            if method == "initialize":
                response = handle_initialize(request_id)
            elif method == "tools/list":
                response = handle_tools_list(request_id)
            elif method == "tools/call":
                response = handle_tool_call(request_id, params)
            else:
                logger.warning(f"Unknown method requested: {method}")
                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "error": {
                        "code": -32601,
                        "message": f"Method not found: {method}"
                    }
                }
            
            send_response(response)
            
        except json.JSONDecodeError as e:
            # Skip malformed JSON lines
            continue
        except EOFError:
            # Normal termination
            break
        except Exception as e:
            # Send error response with request_id if available
            error_response = {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32603,
                    "message": f"Internal error: {str(e)}"
                }
            }
            if request_id is not None:
                error_response["id"] = request_id
            send_response(error_response)

if __name__ == "__main__":
    main()
