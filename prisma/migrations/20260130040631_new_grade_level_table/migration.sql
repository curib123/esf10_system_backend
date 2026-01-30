/*
  Warnings:

  - You are about to drop the column `gradeLevel` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevel` on the `Subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[curriculumVersionId,gradeLevelId,code]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gradeLevelId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeLevelId` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subject_curriculumVersionId_gradeLevel_code_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "gradeLevel",
ADD COLUMN     "gradeLevelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "gradeLevel",
ADD COLUMN     "gradeLevelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevel_code_key" ON "GradeLevel"("code");

-- CreateIndex
CREATE INDEX "Enrollment_gradeLevelId_idx" ON "Enrollment"("gradeLevelId");

-- CreateIndex
CREATE INDEX "Subject_gradeLevelId_idx" ON "Subject"("gradeLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_curriculumVersionId_gradeLevelId_code_key" ON "Subject"("curriculumVersionId", "gradeLevelId", "code");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
