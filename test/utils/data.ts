import { RegisterByCredentialDto } from '../../src/auth/dto';
import { CreateTodoDto, UpdateTodoDto } from '../../src/todo/dto';

const user: RegisterByCredentialDto = {
  account: 'coco',
  password: '123',
  name: 'cocodev',
};

const user2: RegisterByCredentialDto = {
  account: 'coco2',
  password: '123',
  name: 'coco2',
};

const todo: CreateTodoDto = {
  title: 'todo1',
  description: 'desc1',
  startDate: new Date(),
  endDate: new Date(+new Date() + 86400000),
};

const editedTodo: UpdateTodoDto = {
  title: 'todo edited',
  description: 'description edited',
  startDate: new Date(+new Date() + 24 * 60 * 60 * 1000),
  endDate: new Date(+new Date() + 2 * 24 * 60 * 60 * 1000),
};

const todo2: CreateTodoDto = {
  title: 'todo2',
  description: 'desc2',
  startDate: new Date(),
  endDate: new Date(+new Date() + 86400000),
};

const notValidUser = {
  notvaliadprops: 'not valid',
};

const notValidTodo = {
  notvaliadprops: 'not valid',
};

export { user, user2, todo, editedTodo, todo2, notValidUser, notValidTodo };
