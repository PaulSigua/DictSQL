from fastapi import FastAPI
import uvicorn

app = FastAPI(
    title="DictSQL API",
    description="A simple API for managing SQL dictionaries",
    version="1.0.0"
)

@app.get("/")
async def read_root():
    return {
        "API": "DictSQL",
        "status": "ok",
        "frontend": "http://localhost:4200"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=9999, reload=True)
