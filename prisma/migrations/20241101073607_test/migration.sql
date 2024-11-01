-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");
