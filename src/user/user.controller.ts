import { Controller, Get, Param, Post, Query, Body, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

//静的ルートは動的ルートよりも前に記述する

// Get("all") -> /user/all
// Get(":id") -> /user/:id
// Post() -> /user
// Delete(":id") -> /user/:id
// Put(":id") -> /user/:id
// Patch(":id") -> /user/:id

@Controller('user')
export class UserController {
  @Get()
  getUsers(@Query('name') name: string) {
    const users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Bob Johnson' },
    ];

    if (name) {
      return users.filter((user) =>
        user.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    return users;
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return { id, name: 'John Doe' };
  }

  @Post()
  createUser(@Body() CreateUserDto: CreateUserDto) {
    return { data: CreateUserDto, message: 'User created Successfully' };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() CreateUserDto: CreateUserDto) {
    return {
      data: {
        id,
        ...CreateUserDto,
      },
      message: 'User updated Successfully',
    };
  }
}
