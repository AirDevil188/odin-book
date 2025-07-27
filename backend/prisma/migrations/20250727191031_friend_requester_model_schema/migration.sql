/*
  Warnings:

  - You are about to drop the column `senderId` on the `friend_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requesterId,receiverId]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requesterId` to the `friend_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_senderId_fkey";

-- DropIndex
DROP INDEX "friend_requests_senderId_receiverId_key";

-- AlterTable
ALTER TABLE "friend_requests" DROP COLUMN "senderId",
ADD COLUMN     "requesterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_requesterId_receiverId_key" ON "friend_requests"("requesterId", "receiverId");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
