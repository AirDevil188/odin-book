-- DropForeignKey
ALTER TABLE "liked_posts" DROP CONSTRAINT "liked_posts_userId_fkey";

-- AddForeignKey
ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
