-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "friend_requests" DROP CONSTRAINT "friend_requests_requesterId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_friendId_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_userId_fkey";

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
