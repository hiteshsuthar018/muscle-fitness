-- DropForeignKey
ALTER TABLE "public"."Member" DROP CONSTRAINT "Member_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Member" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
