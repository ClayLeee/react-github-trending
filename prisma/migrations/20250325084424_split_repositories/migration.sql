-- CreateTable
CREATE TABLE "DailyRepository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "language" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "trendingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyRepository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "language" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "trendingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MonthlyRepository" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "repoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "language" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "trendingDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyRepository_repoId_key" ON "DailyRepository"("repoId");

-- CreateIndex
CREATE INDEX "DailyRepository_trendingDate_idx" ON "DailyRepository"("trendingDate");

-- CreateIndex
CREATE INDEX "DailyRepository_language_idx" ON "DailyRepository"("language");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRepository_repoId_key" ON "WeeklyRepository"("repoId");

-- CreateIndex
CREATE INDEX "WeeklyRepository_trendingDate_idx" ON "WeeklyRepository"("trendingDate");

-- CreateIndex
CREATE INDEX "WeeklyRepository_language_idx" ON "WeeklyRepository"("language");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyRepository_repoId_key" ON "MonthlyRepository"("repoId");

-- CreateIndex
CREATE INDEX "MonthlyRepository_trendingDate_idx" ON "MonthlyRepository"("trendingDate");

-- CreateIndex
CREATE INDEX "MonthlyRepository_language_idx" ON "MonthlyRepository"("language");
