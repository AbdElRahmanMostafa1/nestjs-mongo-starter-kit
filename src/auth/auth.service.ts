import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { User, UserDocument } from 'src/users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private userService: UsersService,
        private jwt: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user: UserDocument = await this.userService.findByEmail(email);

        if (user) {
            const isPassMatch = await bcrypt.compare(password, user.password);
            if (!isPassMatch) throw new UnauthorizedException('Email or password is not correct');
            else return await this.signToken(user._id.toString(), user.email, user.role);
        } else {
            throw new UnauthorizedException('Email or password is not correct');
        }
    }

    async signUp(signUpDto: SignUpDto) {
        const isUserFound = await this.userService.findByEmail(signUpDto.email);

        if (!isUserFound) {
            const hashedPassword = await this.hashPassword(signUpDto.password);
            const userData = {...signUpDto, password: hashedPassword };
            const newUser = new this.userModel(userData);
            newUser.save();
            return await this.signToken(newUser._id.toString(), newUser.email, newUser.role);
        } else {
            throw new HttpException('This Email already exists', HttpStatus.NOT_ACCEPTABLE)
        }
    }

    async signToken(userId: string, email: string, type: string) {
        const payload = {
          _id: userId,
          email,
        };
        const token = await this.jwt.signAsync(payload)

        return { token, role: type };
      }

    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, 10)
        } catch (error) {
            throw new HttpException("Something went wrong, please try again later", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
