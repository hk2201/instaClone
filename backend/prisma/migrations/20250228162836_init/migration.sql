/*
  Warnings:

  - You are about to drop the column `userId` on the `memberships` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,groupId]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_userId_fkey";

-- DropIndex
DROP INDEX "memberships_userId_groupId_key";

-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "memberships_email_groupId_key" ON "memberships"("email", "groupId");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
