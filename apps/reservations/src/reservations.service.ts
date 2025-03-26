import { Injectable } from '@nestjs/common';
import { ReservationsRepository } from './reservations.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationsRepo: ReservationsRepository) {}

  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepo.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId: '123123',
    });
  }

  findAll() {
    return this.reservationsRepo.find({});
  }

  findOne(id: string) {
    return this.reservationsRepo.findOne({ _id: id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepo.update(
      { _id: id },
      { $set: updateReservationDto },
    );
  }

  remove(id: string) {
    return this.reservationsRepo.delete({ _id: id });
  }
}
