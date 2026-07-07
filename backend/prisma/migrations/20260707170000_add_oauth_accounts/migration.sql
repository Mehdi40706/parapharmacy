-- Add OAuth account link columns.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "facebookId" TEXT;

-- Ensure each provider account can be linked to only one user.
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX IF NOT EXISTS "User_facebookId_key" ON "User"("facebookId");