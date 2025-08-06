from dictsql.api import main
import uvicorn

if __name__ == "__main__":
    main()
    uvicorn.run("dictsql.api:app", host="127.0.0.1", port=9999, reload=True)