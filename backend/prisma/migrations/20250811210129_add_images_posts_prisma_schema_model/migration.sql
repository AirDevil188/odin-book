-- CreateTable
CREATE TABLE "public"."post_images" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "post_images_userId_postId_key" ON "public"."post_images"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."post_images" ADD CONSTRAINT "post_images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_images" ADD CONSTRAINT "post_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
