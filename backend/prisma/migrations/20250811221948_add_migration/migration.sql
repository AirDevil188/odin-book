-- DropIndex
DROP INDEX "public"."post_images_userId_postId_key";

-- AlterTable
ALTER TABLE "public"."post_images" ADD CONSTRAINT "post_images_pkey" PRIMARY KEY ("postId", "imageUrl");
