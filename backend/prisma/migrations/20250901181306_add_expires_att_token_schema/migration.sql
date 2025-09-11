/*
  Warnings:

  - Added the required column `expiresAt` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Token" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
