import { BaseModel } from 'src/common/entity';
import { UserEntity } from 'src/user/entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum StatusEnum {
  UNDONE = 1,
  DONE,
}

@Entity({ name: 'todo' })
export class TodoEntity extends BaseModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ enum: StatusEnum, default: StatusEnum.UNDONE })
  status?: StatusEnum;

  @ManyToOne(() => UserEntity, (user) => user.todos)
  author: UserEntity;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
