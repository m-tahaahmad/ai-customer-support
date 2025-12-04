-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the faqs table if it doesn't exist
CREATE TABLE IF NOT EXISTS faqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    embedding vector(3072), -- text-embedding-3-large produces 3072-dimensional vectors
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create an index on the embedding column for faster similarity search
CREATE INDEX IF NOT EXISTS faqs_embedding_idx ON faqs 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create the match_faqs function for similarity search
CREATE OR REPLACE FUNCTION match_faqs(
    query_embedding vector(3072),
    match_count INT DEFAULT 3,
    match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    id BIGINT,
    question TEXT,
    answer TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        faqs.id,
        faqs.question,
        faqs.answer,
        1 - (faqs.embedding <=> query_embedding) AS similarity
    FROM faqs
    WHERE faqs.embedding IS NOT NULL
        AND 1 - (faqs.embedding <=> query_embedding) > match_threshold
    ORDER BY faqs.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT ON faqs TO authenticated;
-- GRANT EXECUTE ON FUNCTION match_faqs TO authenticated;

