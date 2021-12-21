import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { StudentToAssignment } from 'src/student-to-assignment/entities/student-to-assignment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class PointStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'double' })
  point: number;

  @Column()
  order: number;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  markFile: string;

  @ManyToOne((type) => Classroom, (classroom) => classroom.pointStructures)
  classroom: Classroom;

  @OneToMany(
    (type) => StudentToAssignment,
    (studentToAssginments) => studentToAssginments.assignment,
  )
  studentToAssginments: StudentToAssignment[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
