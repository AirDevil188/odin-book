/*
  Warnings:

  - The primary key for the `liked_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `liked_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timestamp` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,friendId]` on the table `friends` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId]` on the table `liked_comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `liked_posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "liked_comments" DROP CONSTRAINT "liked_comments_pkey";

-- AlterTable
ALTER TABLE "liked_posts" DROP CONSTRAINT "liked_posts_pkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "friends_userId_friendId_key" ON "friends"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "liked_comments_userId_commentId_key" ON "liked_comments"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "liked_posts_userId_postId_key" ON "liked_posts"("userId", "postId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
