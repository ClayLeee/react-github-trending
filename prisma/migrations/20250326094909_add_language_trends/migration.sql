-- CreateTable
CREATE TABLE "LanguageRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LanguageScrapingLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "language" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "status" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT
);

-- CreateIndex
CREATE INDEX "LanguageRepository_language_idx" ON "LanguageRepository"("language");

-- CreateIndex
CREATE INDEX "LanguageRepository_scrapedAt_idx" ON "LanguageRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageRepository_owner_name_language_scrapedAt_key" ON "LanguageRepository"("owner", "name", "language", "scrapedAt");

-- CreateIndex
CREATE INDEX "LanguageScrapingLog_language_idx" ON "LanguageScrapingLog"("language");

-- CreateIndex
CREATE INDEX "LanguageScrapingLog_startTime_idx" ON "LanguageScrapingLog"("startTime");
