-- 1. Activer l'extension AVANT tout usage du type vector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ajouter la colonne (le type vector existe maintenant)
ALTER TABLE "Product" ADD COLUMN "embedding" vector(512);

-- 3. Créer l'index de recherche de similarité (dépend de la colonne ET de l'extension)
CREATE INDEX IF NOT EXISTS product_embedding_hnsw_idx
ON "Product"
USING hnsw (embedding vector_cosine_ops);