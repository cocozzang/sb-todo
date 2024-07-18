import { BaseModel } from 'src/common/entity';
import { Column, Entity } from 'typeorm';

export enum StatusEnum {
  UNDONE,
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
}
