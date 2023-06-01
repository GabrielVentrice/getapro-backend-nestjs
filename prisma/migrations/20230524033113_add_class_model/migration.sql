-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('CREATED', 'STARTED', 'CONCLUDED', 'DONE');

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "status" "ClassStatus" NOT NULL,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
