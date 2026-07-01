import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

//静的ルートは動的ルートよりも前に記述する

// Get("all") -> /user/all
// Get(":id") -> /user/:id
// Post() -> /user
// Delete(":id") -> /user/:id
// Put(":id") -> /user/:id
// Patch(":id") -> /user/:id

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query('name') name: string): unknown {
    return this.userService.findAllUsers(name);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneUser(id);
  }

  @Post()
  createUser(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.createUser(CreateUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() CreateUserDto: CreateUserDto) {
    return this.userService.updateUser(Number(id), CreateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }
}
