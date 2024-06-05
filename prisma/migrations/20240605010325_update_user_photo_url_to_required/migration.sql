/*
  Warnings:

  - Made the column `photoUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "photoUrl" SET NOT NULL;
