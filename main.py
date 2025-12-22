from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from chatbot.graph import create_app_async, init_mongo_saver
from langchain_core.messages import HumanMessage, AIMessageChunk
from contextlib import asynccontextmanager
from typing import Optional
from uuid import uuid4
import json
import traceback


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context: handles MongoDB saver and graph initialization."""
    print("🔄 Initializing MongoDB and LangGraph...")

    try:
        # Initialize MongoDB saver (synchronous context manager)
        with init_mongo_saver() as checkpointer:
            graph = await create_app_async(checkpointer)
            if not graph:
                raise RuntimeError("Graph initialization failed — check logs above.")

            # Store for later use
            app.state.graph = graph
            app.state.checkpointer = checkpointer

            print("✅ MongoDB + LangGraph initialized successfully")

            # Keep the saver open while app runs
            yield

        print("✅ MongoDB connection closed cleanly")

    except Exception as e:
        print("❌ Error during app startup:")
        traceback.print_exc()
        # Yield nothing but allow app to fail gracefully
        yield


# Initialize app with lifespan management
app = FastAPI(lifespan=lifespan)

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type"],
)


@app.get("/")
async def root():
    """Root endpoint — verify graph initialized."""
    return {
        "status": "ok",
        "graph_initialized": hasattr(app.state, "graph")
    }


@app.get("/health")
async def health():
    """Basic Render/Infra health check."""
    return {"status": "healthy"}


def serialise_ai_message_chunk(chunk):
    """Safely serialise AI message chunks."""
    if isinstance(chunk, AIMessageChunk):
        return chunk.content
    raise TypeError(f"Invalid chunk type: {type(chunk).__name__}")


async def generate_chat_responses(graph, message: str, checkpoint_id: Optional[str] = None):
    """Stream chat responses as Server-Sent Events (SSE)."""
    try:
        is_new_conversation = checkpoint_id is None

        if is_new_conversation:
            new_checkpoint_id = str(uuid4())
            config = {"configurable": {"thread_id": new_checkpoint_id}}
            events = graph.astream_events(
                {"messages": [HumanMessage(content=message)]},
                version="v2",
                config=config,
            )
            yield f"data: {json.dumps({'type': 'checkpoint', 'checkpoint_id': new_checkpoint_id})}\n\n"
        else:
            config = {"configurable": {"thread_id": checkpoint_id}}
            events = graph.astream_events(
                {"messages": [HumanMessage(content=message)]},
                version="v2",
                config=config,
            )

        async for event in events:
            event_type = event.get("event")
            

            if event_type == "on_chat_model_start":
                yield f"data: {json.dumps({'type': 'thinking'})}\n\n"

            elif event_type == "on_chat_model_stream":
                chunk_content = serialise_ai_message_chunk(event["data"]["chunk"])
                if chunk_content:
                    yield f"data: {json.dumps({'type': 'content', 'content': chunk_content})}\n\n"

            elif event_type == "on_tool_start":
                print(f"🔄 Event: {event}")
                name = event.get("name")
                input_data = event["data"].get("input", {})
                query = input_data.get("query", "")
                if name:
                    yield f"data: {json.dumps({'type': f'{name}_start', 'query': query})}\n\n"

            elif event_type == "on_tool_end":
                print(f"🔄 Event: {event}")
                name = event.get("name")
                output = event["data"].get("output", "")
                if not output:
                    continue

                if name == "rag_tool":
                    snippet = output[100:200] + "......"
                    yield f"data: {json.dumps({'type': 'rag_results', 'context': snippet})}\n\n"
                elif name == "tavily_search":
                    urls = [r["url"] for r in output.get("results", [])]
                    yield f"data: {json.dumps({'type': 'search_results', 'urls': urls})}\n\n"
                elif name == "indian_kannon_search_tool":
                    url = output[0].get("link", "") if isinstance(output, list) and output else ""
                    yield f"data: {json.dumps({'type': 'i_search_results', 'url': url})}\n\n"

        yield f"data: {json.dumps({'type': 'end'})}\n\n"

    except Exception as e:
        traceback.print_exc()
        yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"


@app.get("/chat_stream/{message}")
async def chat_stream(message: str, checkpoint_id: Optional[str] = Query(None)):
    """Stream responses for a chat message."""
    graph = getattr(app.state, "graph", None)
    if not graph:
        return StreamingResponse(
            iter([f"data: {json.dumps({'type': 'error', 'error': 'Graph not initialized'})}\n\n"]),
            media_type="text/event-stream",
        )

    return StreamingResponse(
        generate_chat_responses(graph, message, checkpoint_id),
        media_type="text/event-stream",
    )
