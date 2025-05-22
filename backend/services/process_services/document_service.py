# services/process_services/document_service.py

import fitz  # PyMuPDF
from services.process_services.pinecone_client import get_pinecone_client

# Initialize Pinecone client
pc = get_pinecone_client()
index_name = "company-documents"  # define your fixed index name (one index, many namespaces)



def chunk_text_with_overlap(text: str, max_length: int = 1024, overlap: float = 0.3) -> list[str]:
    """
    split text into overlapping chunks for better semantic coverage.
    """
    step = int(max_length * (1 - overlap))
    chunks = []

    for i in range(0, len(text), step):
        chunk = text[i:i + max_length]
        if len(chunk.strip()) >= 100:  # Skip very short/empty chunks
            chunks.append(chunk.strip())
        if i + max_length >= len(text):
            break
    return chunks

def extract_text_from_pdf(file_path: str) -> list[str]:
    """
    Extract and chunk text from each page of a PDF with 30% overlap.

    """
    doc = fitz.open(file_path)
    all_chunks = []

    for page in doc:
        text = page.get_text()
        if text.strip():
            chunks = chunk_text_with_overlap(text.strip(), max_length=1024, overlap=0.3)
            all_chunks.extend(chunks)

    return all_chunks



def embed_texts(texts: list[str], input_type="passage") -> list:
    """Embed a list of texts using Pinecone inference."""
    embeddings = pc.inference.embed(
        model="llama-text-embed-v2",
        inputs=texts,
        parameters={"input_type": input_type}
    )
    return embeddings

def upsert_documents(data: list[dict], index_name: str, namespace: str):
    """Upsert a list of text documents into Pinecone."""

    # Ensure the index exists
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    if index_name not in existing_indexes:
        pc.create_index_for_model(
            name=index_name,
            cloud="aws",
            region="us-east-1",
            embed={
                "model":"llama-text-embed-v2",
                "field_map":{"text": "chunk_text"}
            }
        )



    # Connect to the correct index
    index = pc.Index(index_name)

    # Embed texts
    texts = [d["text"] for d in data]
    embeddings = embed_texts(texts, input_type="passage")

    # Prepare vectors
    vectors = []
    for d, e in zip(data, embeddings):
        vectors.append({
            "id": d["id"],
            "values": e["values"],
            "metadata": {
                "text": d["text"]
            }
        })

    # Upsert vectors
    index.upsert(
        vectors=vectors,
        namespace=namespace
    )

def query_documents(
    query: str,
    namespace: str,
    index_name: str,   # Must exist here!
    top_k: int = 2
):
    """Query similar documents from a specified Pinecone index and namespace."""

    index = pc.Index(index_name)   # ✅ Must use passed index_name

    query_embedding = embed_texts([query], input_type="query")[0]

    results = index.query(
        namespace=namespace,
        vector=query_embedding.values,
        top_k=top_k,
        include_values=False,
        include_metadata=True
    )
    return results