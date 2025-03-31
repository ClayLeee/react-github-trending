-- 添加 isMonthly 欄位到 Repository 表
ALTER TABLE "Repository" ADD COLUMN "isMonthly" BOOLEAN NOT NULL DEFAULT false;
-- 為 isMonthly 欄位創建索引
CREATE INDEX "Repository_isMonthly_idx" ON "Repository"("isMonthly");
