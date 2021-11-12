import { Classroom } from 'src/classrooms/entities/classroom.entity';
import { UserToClass } from 'src/user-to-class/entities/user-to-class.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { UserRole } from '../decorator/user.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  googleId: string;
  
  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({nullable:true})
  password: string;

  // @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  // role: UserRole;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @OneToMany(() => Classroom, (classroom) => classroom.created_by)
  classrooms: Classroom[];

  @OneToMany((type) => UserToClass, (userToClass) => userToClass.user)
  userToClasses: UserToClass[];
}
