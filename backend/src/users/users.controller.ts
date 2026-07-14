import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FindUsersDto } from './dto/find-user.dto';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() query: FindUsersDto) {
    return this.usersService.findAll(query);
  }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: 'CLIENT' | 'ADMIN') {
    return this.usersService.updateRole(id, role);
  }
}