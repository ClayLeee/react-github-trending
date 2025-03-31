-- CreateTable
CREATE TABLE "JavaScriptRepository" (
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
CREATE TABLE "TypeScriptRepository" (
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
CREATE TABLE "PythonRepository" (
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
CREATE TABLE "JavaRepository" (
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
CREATE TABLE "CppRepository" (
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
CREATE TABLE "CsharpRepository" (
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
CREATE TABLE "GoRepository" (
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
CREATE TABLE "RustRepository" (
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
CREATE TABLE "RubyRepository" (
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
CREATE TABLE "PhpRepository" (
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
CREATE TABLE "SwiftRepository" (
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
CREATE TABLE "KotlinRepository" (
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
CREATE TABLE "DartRepository" (
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
CREATE INDEX "JavaScriptRepository_scrapedAt_idx" ON "JavaScriptRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaScriptRepository_owner_name_key" ON "JavaScriptRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "TypeScriptRepository_scrapedAt_idx" ON "TypeScriptRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TypeScriptRepository_owner_name_key" ON "TypeScriptRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PythonRepository_scrapedAt_idx" ON "PythonRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PythonRepository_owner_name_key" ON "PythonRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "JavaRepository_scrapedAt_idx" ON "JavaRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JavaRepository_owner_name_key" ON "JavaRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CppRepository_scrapedAt_idx" ON "CppRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CppRepository_owner_name_key" ON "CppRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "CsharpRepository_scrapedAt_idx" ON "CsharpRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CsharpRepository_owner_name_key" ON "CsharpRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "GoRepository_scrapedAt_idx" ON "GoRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoRepository_owner_name_key" ON "GoRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RustRepository_scrapedAt_idx" ON "RustRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RustRepository_owner_name_key" ON "RustRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "RubyRepository_scrapedAt_idx" ON "RubyRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RubyRepository_owner_name_key" ON "RubyRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "PhpRepository_scrapedAt_idx" ON "PhpRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PhpRepository_owner_name_key" ON "PhpRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "SwiftRepository_scrapedAt_idx" ON "SwiftRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SwiftRepository_owner_name_key" ON "SwiftRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "KotlinRepository_scrapedAt_idx" ON "KotlinRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "KotlinRepository_owner_name_key" ON "KotlinRepository"("owner", "name");

-- CreateIndex
CREATE INDEX "DartRepository_scrapedAt_idx" ON "DartRepository"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DartRepository_owner_name_key" ON "DartRepository"("owner", "name");
