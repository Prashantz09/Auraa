/*
  Warnings:

  - You are about to drop the column `isVertical` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "isVertical",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'horizontal';
