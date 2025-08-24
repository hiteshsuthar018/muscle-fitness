-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_recordedBy_fkey";

-- AlterTable
ALTER TABLE "public"."Attendance" ALTER COLUMN "recordedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
