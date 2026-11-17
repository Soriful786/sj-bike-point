import { BookingStatus, MotorcycleType } from '@prisma/client';
export declare class CustomerInput {
    name: string;
    phone: string;
    email?: string;
}
export declare class MotorcycleInput {
    brand: string;
    model: string;
    registrationNumber: string;
    type?: MotorcycleType;
    manufacturingYear?: number;
}
export declare class CreateBookingDto {
    customer: CustomerInput;
    motorcycle: MotorcycleInput;
    serviceIds: string[];
    date: string;
    time: string;
    customerNote?: string;
}
export declare class AdminCreateBookingDto extends CreateBookingDto {
    internalNote?: string;
    allowOverCapacity?: boolean;
}
export declare class TrackBookingDto {
    bookingRef: string;
    phone: string;
}
export declare class ChangeStatusDto {
    status: BookingStatus;
    note?: string;
}
export declare class RescheduleDto {
    date: string;
    time: string;
    allowOverCapacity?: boolean;
}
export declare class AssignMechanicDto {
    mechanicId: string;
}
export declare class ListBookingsQuery {
    page?: number;
    limit?: number;
    q?: string;
    status?: BookingStatus;
    date?: string;
    serviceId?: string;
}
