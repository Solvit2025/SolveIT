# services/process_services/pinecone_client.py

from pinecone import Pinecone
from config import PINECONE_API_KEY

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Return the Pinecone client
def get_pinecone_client():
    return pc
