/*
  Warnings:

  - You are about to drop the column `category` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "category",
DROP COLUMN "featured",
DROP COLUMN "type",
ADD COLUMN     "isVertical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[];
