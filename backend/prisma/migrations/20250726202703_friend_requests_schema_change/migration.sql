/*
  Warnings:

  - The primary key for the `friend_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `secondUserId` on the `friend_requests` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `friend_requests` table. All the data in the column will be lost.
  - You are about to drop the `friend_request` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `friend_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `friend_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `friend_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('pending', 'accepted', 'declined');

-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_secondUserId_fkey";

-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_userId_fkey";

-- AlterTable
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_pkey",
DROP COLUMN "secondUserId",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "status" "FriendRequestStatus" NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "friend_request";

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_senderId_receiverId_key" ON "friend_requests"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
