from fastapi import FastAPI
from pydantic import BaseModel
from Interpreter.myrpal import interpret
from fastapi.middleware.cors import CORSMiddleware

class CodeInput(BaseModel):
    code: str
    ast : bool = False
    st : bool = False

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://rpal-online.vercel.app",
    "https://rpal-online.vercel.app/interpreter"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}

@app.head("/health")
async def health_check_head():
    return {"status": "ok", "message": "Server is running"}

@app.post("/")
async def interpret_code(code: CodeInput):
    print(f"Received code: {code.code}")
    try:
        result = interpret(code.code, sendAST=code.ast, sendST=code.st)
        return {"result": result.get("resOut", None),
                "ast": result.get("resAST", None),
                "st": result.get("resST", None)}
    except Exception as e:
        return {"error": str(e)}
    
