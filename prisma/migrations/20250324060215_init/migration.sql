-- CreateTable
CREATE TABLE "Repository" (
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
    "isDaily" BOOLEAN NOT NULL DEFAULT false,
    "isWeekly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_repoId_key" ON "Repository"("repoId");

-- CreateIndex
CREATE INDEX "Repository_trendingDate_idx" ON "Repository"("trendingDate");

-- CreateIndex
CREATE INDEX "Repository_language_idx" ON "Repository"("language");

-- CreateIndex
CREATE INDEX "Repository_isDaily_idx" ON "Repository"("isDaily");

-- CreateIndex
CREATE INDEX "Repository_isWeekly_idx" ON "Repository"("isWeekly");
