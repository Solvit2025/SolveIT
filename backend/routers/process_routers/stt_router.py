# routers/process_routers/stt_router.py

from fastapi import APIRouter, Request
from faster_whisper import WhisperModel

router = APIRouter(prefix="/transcribe", tags=["Transcription"])

@router.post("/")
async def transcribe(request: Request):
    body = await request.body()

    with open("temp_audio.webm", "wb") as f:
        f.write(body)

    model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    segments, info = model.transcribe("temp_audio.webm")

    full_text = " ".join([seg.text for seg in segments])
    return {"text": full_text, "language": info.language}
