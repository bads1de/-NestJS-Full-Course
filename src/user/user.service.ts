import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from './user.logger';
import { CreateUserDto } from './dto/create-user.dto';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  constructor(private readonly loggerService: LoggerService) {}

  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'test@example.com' },
    { id: 2, name: 'Jane Smith', email: 'test@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'test@example.com' },
  ];

  findAllUsers(name: string = '') {
    this.loggerService.log(`find all users with name: ${name}`);

    return this.users.filter((user) =>
      user.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );
  }

  findOneUser(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    this.loggerService.log(`find user with id: ${id}`);
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    this.loggerService.log(`create user`);
    const newUser: User = {
      id: this.users.length + 1,
      name: createUserDto.name,
      email: '',
    };

    this.users.push(newUser);
  }

  updateUser(id: number, createUserDto: CreateUserDto) {
    this.loggerService.log(`update user with id: ${id}`);

    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    this.users[index] = {
      id,
      ...createUserDto,
      email: this.users[index].email,
    };

    return this.users[index];
  }

  deleteUser(id: number) {
    this.loggerService.log(`delete user with id: ${id}`);

    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    const [deleted] = this.users.splice(index, 1);

    return deleted;
  }
}
