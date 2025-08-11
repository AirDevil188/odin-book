-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_groupId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_fkey";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
