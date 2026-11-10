-- CreateTable
CREATE TABLE "garage_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "openingTime" TEXT NOT NULL DEFAULT '09:00',
    "closingTime" TEXT NOT NULL DEFAULT '21:00',
    "slotLengthMin" INTEGER NOT NULL DEFAULT 60,
    "capacityPerSlot" INTEGER NOT NULL DEFAULT 5,
    "weeklyOffDays" INTEGER[] DEFAULT ARRAY[5]::INTEGER[],
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "advanceBookingDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garage_settings_pkey" PRIMARY KEY ("id")
);
