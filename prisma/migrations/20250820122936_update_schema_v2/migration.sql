/*
  Warnings:

  - The values [YOUTH,WOMEN] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `gender` on the `Member` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventCategory_new" AS ENUM ('SABBATH', 'AMO', 'ALO', 'BIBLE_STUDY', 'SOCIAL', 'GENERAL');
ALTER TABLE "public"."Event" ALTER COLUMN "category" TYPE "public"."EventCategory_new" USING ("category"::text::"public"."EventCategory_new");
ALTER TYPE "public"."EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "public"."EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "public"."EventCategory_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."OfferingCategory" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "public"."Member" DROP COLUMN "gender",
ADD COLUMN     "graduationYear" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "gender" "public"."Gender",
ADD COLUMN     "homeChurch" TEXT;
