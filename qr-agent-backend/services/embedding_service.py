# services/embedding_service.py
import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from models.menu_item import MenuItem
from models import db


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embedding_dim = 384  # Dimension for all-MiniLM-L6-v2
        self.indexes = {}  # {org_id: faiss_index}
        self.id_to_item = {}  # {org_id: {index: item_id}}

    def build_index_for_organization(self, org_id):
        """Builds and stores FAISS index for a specific organization"""
        items = MenuItem.query.filter_by(organization_id=org_id).all()
        if not items:
            return False

        texts = [f"{item.name} {item.description or ''}" for item in items]
        embeddings = self.model.encode(texts)
        embeddings = np.array(embeddings).astype('float32')

        index = faiss.IndexFlatL2(self.embedding_dim)
        index.add(embeddings)

        self.indexes[org_id] = index
        self.id_to_item[org_id] = {i: item.id for i, item in enumerate(items)}
        # Save index to file
        os.makedirs('static/embeddings', exist_ok=True)
        faiss.write_index(index, f'static/embeddings/org_{org_id}.index')
        return True

    def search_menu_items(self, org_id, query, k=5):
        """Search for top-k similar items based on natural language query"""
        if org_id not in self.indexes:
            self.build_index_for_organization(org_id)

        index = self.indexes.get(org_id)
        if not index:
            return []

        query_embedding = self.model.encode([query])
        query_embedding = np.array(query_embedding).astype('float32')

        distances, indices = index.search(query_embedding, k=k)
        results = []
        for i in range(k):
            idx = indices[0][i]
            score = float(distances[0][i])
            if idx != -1 and score < 1.0:  # Threshold to filter irrelevant matches
                item_id = self.id_to_item[org_id].get(idx)
                item = MenuItem.query.get(item_id)
                if item and item.is_available:
                    results.append({
                        "item": item.to_dict(),
                        "score": score
                    })
        return results
