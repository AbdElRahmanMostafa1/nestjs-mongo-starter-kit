import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { GetAuthCredentials } from './dto/getAuthCreds.dto';
import { TransformInterceptor } from 'src/common/interceptors/transform.interceptor';
import { BaseApiResponse } from 'src/common/dto/api-response/baseApiResponse.dto';

@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto
    ): Promise<BaseApiResponse<GetAuthCredentials>> {
        const loginResponse = await this.authService.login(loginDto);
        return {
            data: loginResponse,
            message: 'User logged in Successfully',
        }         
    }

    @Post('signup')
    async signUp(
            @Body() signUpDto: SignUpDto
        ): Promise<BaseApiResponse<GetAuthCredentials>> {
        const signUpResponse = await this.authService.signUp(signUpDto);
        return {
            data: signUpResponse,
            message: "Created Successfully"
        }
    }
}
