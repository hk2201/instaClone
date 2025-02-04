/*
  Warnings:

  - Added the required column `lastname` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastname" TEXT NOT NULL,
ALTER COLUMN "username" SET NOT NULL;
