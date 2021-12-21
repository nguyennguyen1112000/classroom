import { PointStructure } from 'src/point-structure/entities/point-structure.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StudentToAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double', nullable: true })
  point: number;

  @Column()
  classroomId: number;

  @Column({ nullable: true })
  studentId?: string;

  @Column({ nullable: true })
  assignmentId?: number;

  @ManyToOne(
    () => PointStructure,
    (assignment) => assignment.studentToAssginments,
  )
  assignment: PointStructure;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}
