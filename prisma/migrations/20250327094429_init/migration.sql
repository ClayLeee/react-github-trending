/*
  Warnings:

  - You are about to drop the `CppRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CsharpRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DartRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JavaRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JavaScriptRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KotlinRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LanguageRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LanguageScrapingLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhpRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PythonRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RubyRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RustRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SwiftRepository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeScriptRepository` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CppRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CsharpRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DartRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GoRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JavaRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "JavaScriptRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "KotlinRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LanguageRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LanguageScrapingLog";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PhpRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PythonRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Repository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RubyRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RustRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SwiftRepository";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TypeScriptRepository";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CPPDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CPPWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CPPMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GoDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GoWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GoMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaScriptDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaScriptWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaScriptMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TypeScriptDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TypeScriptWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TypeScriptMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PythonDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PythonWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PythonMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JavaMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CSharpDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CSharpWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CSharpMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RustDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RustWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RustMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RubyDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RubyWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RubyMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhpDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhpWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhpMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SwiftDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SwiftWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SwiftMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KotlinDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KotlinWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KotlinMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DartDailyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DartWeeklyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DartMonthlyRepository" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "stars" INTEGER NOT NULL,
    "currentStars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "CPPDailyRepository_scrapedAt_idx" ON "CPPDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CPPDailyRepository_owner_name_key" ON "CPPDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CPPWeeklyRepository_scrapedAt_idx" ON "CPPWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CPPWeeklyRepository_owner_name_key" ON "CPPWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CPPMonthlyRepository_scrapedAt_idx" ON "CPPMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CPPMonthlyRepository_owner_name_key" ON "CPPMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "GoDailyRepository_scrapedAt_idx" ON "GoDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoDailyRepository_owner_name_key" ON "GoDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "GoWeeklyRepository_scrapedAt_idx" ON "GoWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoWeeklyRepository_owner_name_key" ON "GoWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "GoMonthlyRepository_scrapedAt_idx" ON "GoMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoMonthlyRepository_owner_name_key" ON "GoMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaScriptDailyRepository_scrapedAt_idx" ON "JavaScriptDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaScriptDailyRepository_owner_name_key" ON "JavaScriptDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaScriptWeeklyRepository_scrapedAt_idx" ON "JavaScriptWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaScriptWeeklyRepository_owner_name_key" ON "JavaScriptWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaScriptMonthlyRepository_scrapedAt_idx" ON "JavaScriptMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaScriptMonthlyRepository_owner_name_key" ON "JavaScriptMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "TypeScriptDailyRepository_scrapedAt_idx" ON "TypeScriptDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TypeScriptDailyRepository_owner_name_key" ON "TypeScriptDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "TypeScriptWeeklyRepository_scrapedAt_idx" ON "TypeScriptWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TypeScriptWeeklyRepository_owner_name_key" ON "TypeScriptWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "TypeScriptMonthlyRepository_scrapedAt_idx" ON "TypeScriptMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TypeScriptMonthlyRepository_owner_name_key" ON "TypeScriptMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PythonDailyRepository_scrapedAt_idx" ON "PythonDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PythonDailyRepository_owner_name_key" ON "PythonDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PythonWeeklyRepository_scrapedAt_idx" ON "PythonWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PythonWeeklyRepository_owner_name_key" ON "PythonWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PythonMonthlyRepository_scrapedAt_idx" ON "PythonMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PythonMonthlyRepository_owner_name_key" ON "PythonMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaDailyRepository_scrapedAt_idx" ON "JavaDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaDailyRepository_owner_name_key" ON "JavaDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaWeeklyRepository_scrapedAt_idx" ON "JavaWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaWeeklyRepository_owner_name_key" ON "JavaWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaMonthlyRepository_scrapedAt_idx" ON "JavaMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaMonthlyRepository_owner_name_key" ON "JavaMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CSharpDailyRepository_scrapedAt_idx" ON "CSharpDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CSharpDailyRepository_owner_name_key" ON "CSharpDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CSharpWeeklyRepository_scrapedAt_idx" ON "CSharpWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CSharpWeeklyRepository_owner_name_key" ON "CSharpWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CSharpMonthlyRepository_scrapedAt_idx" ON "CSharpMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CSharpMonthlyRepository_owner_name_key" ON "CSharpMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RustDailyRepository_scrapedAt_idx" ON "RustDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RustDailyRepository_owner_name_key" ON "RustDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RustWeeklyRepository_scrapedAt_idx" ON "RustWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RustWeeklyRepository_owner_name_key" ON "RustWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RustMonthlyRepository_scrapedAt_idx" ON "RustMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RustMonthlyRepository_owner_name_key" ON "RustMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RubyDailyRepository_scrapedAt_idx" ON "RubyDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RubyDailyRepository_owner_name_key" ON "RubyDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RubyWeeklyRepository_scrapedAt_idx" ON "RubyWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RubyWeeklyRepository_owner_name_key" ON "RubyWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RubyMonthlyRepository_scrapedAt_idx" ON "RubyMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RubyMonthlyRepository_owner_name_key" ON "RubyMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PhpDailyRepository_scrapedAt_idx" ON "PhpDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhpDailyRepository_owner_name_key" ON "PhpDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PhpWeeklyRepository_scrapedAt_idx" ON "PhpWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhpWeeklyRepository_owner_name_key" ON "PhpWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PhpMonthlyRepository_scrapedAt_idx" ON "PhpMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhpMonthlyRepository_owner_name_key" ON "PhpMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "SwiftDailyRepository_scrapedAt_idx" ON "SwiftDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SwiftDailyRepository_owner_name_key" ON "SwiftDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "SwiftWeeklyRepository_scrapedAt_idx" ON "SwiftWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SwiftWeeklyRepository_owner_name_key" ON "SwiftWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "SwiftMonthlyRepository_scrapedAt_idx" ON "SwiftMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SwiftMonthlyRepository_owner_name_key" ON "SwiftMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "KotlinDailyRepository_scrapedAt_idx" ON "KotlinDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KotlinDailyRepository_owner_name_key" ON "KotlinDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "KotlinWeeklyRepository_scrapedAt_idx" ON "KotlinWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KotlinWeeklyRepository_owner_name_key" ON "KotlinWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "KotlinMonthlyRepository_scrapedAt_idx" ON "KotlinMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KotlinMonthlyRepository_owner_name_key" ON "KotlinMonthlyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "DartDailyRepository_scrapedAt_idx" ON "DartDailyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DartDailyRepository_owner_name_key" ON "DartDailyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "DartWeeklyRepository_scrapedAt_idx" ON "DartWeeklyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DartWeeklyRepository_owner_name_key" ON "DartWeeklyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "DartMonthlyRepository_scrapedAt_idx" ON "DartMonthlyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DartMonthlyRepository_owner_name_key" ON "DartMonthlyRepository"("owner", "name");
