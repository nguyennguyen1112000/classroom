import { PointStructure } from 'src/point-structure/entities/point-structure.entity';
import { UserToClass } from 'src/user-to-class/entities/user-to-class.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  topic: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  code: string;

  @ManyToOne(() => User, (user) => user.classrooms)
  created_by: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany((type) => UserToClass, (userToClass) => userToClass.classroom)
  public userToClasses: UserToClass[];

  @OneToMany(
    (type) => PointStructure,
    (pointStructure) => pointStructure.classroom,
  ) 
  pointStructures: PointStructure[];
}
