import Backend.services.process_services.pinecone_client as pinecone_client
from sentence_transformers import SentenceTransformer

pinecone_client.init(api_key="your-pinecone-api-key", environment="your-env")
index = pinecone_client.Index("your-index-name")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def get_relevant_docs(query: str, top_k: int = 3):
    query_vec = embedder.encode(query).tolist()
    results = index.query(vector=query_vec, top_k=top_k, include_metadata=True)
    return [match['metadata']['content'] for match in results['matches']]
