import json
from typing import List, Tuple
from services.process_services.document_service import query_documents
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from config import OPENROUTER_API
import os


async def perform_semantic_search(query: str, namespace: str, index_name: str, top_k: int = 2) -> List[dict]:
    try:
        search_results = query_documents(
            query=query,
            namespace=namespace,
            index_name=index_name,
            top_k=top_k
        )
        return search_results.to_dict().get("matches", [])
    except Exception as e:
        raise RuntimeError(f"Semantic search failed: {str(e)}")


async def generate_llm_answer(formatted_service_category: str, user_query: str, document_context: str) -> Tuple[str, str]:
    system_prompt = f"""You are a helpful assistant for {formatted_service_category}. 
        Only use the relevant company document context below to answer the user's question. 
        Do not add unrelated information. 
        Do not guess.

        Respond in JSON format only:
        {{
            "answer": "..."
        }}

        If the answer is not found, say: 'I'm sorry, I couldn't find the answer to that question.'"""

    user_prompt = f"User Question: {user_query}\n\nCompany Documents:\n{document_context}"

    llm = ChatOpenAI(
        model="mistralai/mistral-7b-instruct",
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key=OPENROUTER_API,  # Use env var!
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]

    llm_response = llm(messages).content

    try:
        parsed = json.loads(llm_response)
        return llm_response, parsed.get("answer", "")
    except json.JSONDecodeError:
        return llm_response, "Sorry, I could not parse the response from the AI model."
