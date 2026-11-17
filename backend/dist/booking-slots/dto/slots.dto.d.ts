export declare class AvailabilityQuery {
    date: string;
}
export declare class UpdateGarageSettingsDto {
    openingTime?: string;
    closingTime?: string;
    slotLengthMin?: number;
    capacityPerSlot?: number;
    weeklyOffDays?: number[];
    advanceBookingDays?: number;
}
export declare class CreateSlotOverrideDto {
    date: string;
    startTime?: string;
    capacity?: number;
    isClosed?: boolean;
    reason?: string;
}
