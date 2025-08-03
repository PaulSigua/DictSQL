import uvicorn

if __name__ == "__main__":
    uvicorn.run("dictsql.api:app", host="127.0.0.1", port=9999, reload=True)