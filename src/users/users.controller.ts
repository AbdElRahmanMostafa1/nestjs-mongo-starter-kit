import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
