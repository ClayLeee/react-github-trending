-- CreateTable
CREATE TABLE "ScrapingJobLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobName" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "status" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ScrapingJobLog_jobName_idx" ON "ScrapingJobLog"("jobName");

-- CreateIndex
CREATE INDEX "ScrapingJobLog_status_idx" ON "ScrapingJobLog"("status");

-- CreateIndex
CREATE INDEX "ScrapingJobLog_startTime_idx" ON "ScrapingJobLog"("startTime");
