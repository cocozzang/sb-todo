import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { Request } from 'express';
import { COOKIE_MAX_AGE } from '../common/const';
import { IsUserMineOrAdminGuard } from './is-user-mine-or-admim.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // session user와 해당 userId의 유저가 본인 또는 sub admin권한이 있을때 guard pass
  @UseGuards(IsUserMineOrAdminGuard)
  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number) {
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new NotFoundException('해당유저는 존재하지 않습니다.');
    }

    return user;
  }

  @UseGuards(IsUserMineOrAdminGuard)
  @Patch(':userId')
  async patchUserById(
    @Req() req: Request,
    @Body() dto: UpdateUserDto,
    @Param('userId') userId: number,
  ) {
    const user = await this.getUserById(userId);

    const updateResult = await this.userService.updateUser(dto, userId);

    if (!updateResult) return false;

    req.res.cookie(
      'user.info',
      JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        profile: user.profileImage,
      }),
      {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
      },
    );

    return true;
  }

  @UseGuards(IsUserMineOrAdminGuard)
  @Delete(':userId')
  async deleteUserById(@Req() req: Request, @Param('userId') userId: number) {
    await this.getUserById(userId);

    const deleteResult = await this.userService.deleteUser(userId);

    if (!deleteResult) return false;

    req.res.clearCookie('user.info');
    req.session.destroy(() => {});
    req.res.clearCookie('connect.sid');

    return true;
  }
}
