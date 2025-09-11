/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `Token` table. All the data in the column will be lost.
  - Added the required column `selector` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_pkey",
DROP COLUMN "id",
DROP COLUMN "used",
ADD COLUMN     "selector" TEXT NOT NULL,
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("selector");
