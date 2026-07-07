-- Rename refresh token storage column to reflect hashed values.
ALTER TABLE "RefreshToken" RENAME COLUMN "token" TO "tokenHash";

-- Recreate the unique index with the new column name.
DROP INDEX IF EXISTS "RefreshToken_token_key";
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");