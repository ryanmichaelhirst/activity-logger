-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL DEFAULT ('act_'::text || nanoid()),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "objectId" TEXT,
    "photoUrl" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_uid_key" ON "Activity"("uid");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
