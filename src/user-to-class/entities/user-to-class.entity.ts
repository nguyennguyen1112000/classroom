import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { UserRole } from 'src/users/decorator/user.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class UserToClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  classroomId: number;

  @ManyToOne(() => User, (user) => user.userToClasses)
  user: User;

  @ManyToOne(() => Classroom, (classroom) => classroom.userToClasses)
  classroom: Classroom;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}
