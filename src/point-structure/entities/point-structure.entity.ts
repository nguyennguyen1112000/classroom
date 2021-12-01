import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class PointStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  point: number;

  @Column()
  order: number;

  @ManyToOne((type) => Classroom, (classroom) => classroom.pointStructures)
  classroom: Classroom;
}
