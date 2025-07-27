/*
  Warnings:

  - You are about to drop the `FriendshipUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendshipUsers" DROP CONSTRAINT "FriendshipUsers_friendId_fkey";

-- DropForeignKey
ALTER TABLE "FriendshipUsers" DROP CONSTRAINT "FriendshipUsers_userId_fkey";

-- AlterTable
ALTER TABLE "friends" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FriendshipUsers";

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
