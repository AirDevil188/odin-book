-- DropForeignKey
ALTER TABLE "liked_comments" DROP CONSTRAINT "liked_comments_userId_fkey";

-- AddForeignKey
ALTER TABLE "liked_comments" ADD CONSTRAINT "liked_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
