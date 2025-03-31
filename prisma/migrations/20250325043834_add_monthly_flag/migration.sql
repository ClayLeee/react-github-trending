/*
  Warnings:

  - You are about to drop the column `isAI` on the `Repository` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Repository" (
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
    "isMonthly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Repository" ("createdAt", "currentStars", "description", "forks", "id", "isDaily", "isWeekly", "language", "name", "owner", "repoId", "stars", "trendingDate", "updatedAt", "url") SELECT "createdAt", "currentStars", "description", "forks", "id", "isDaily", "isWeekly", "language", "name", "owner", "repoId", "stars", "trendingDate", "updatedAt", "url" FROM "Repository";
DROP TABLE "Repository";
ALTER TABLE "new_Repository" RENAME TO "Repository";
CREATE UNIQUE INDEX "Repository_repoId_key" ON "Repository"("repoId");
CREATE INDEX "Repository_trendingDate_idx" ON "Repository"("trendingDate");
CREATE INDEX "Repository_language_idx" ON "Repository"("language");
CREATE INDEX "Repository_isDaily_idx" ON "Repository"("isDaily");
CREATE INDEX "Repository_isWeekly_idx" ON "Repository"("isWeekly");
CREATE INDEX "Repository_isMonthly_idx" ON "Repository"("isMonthly");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
