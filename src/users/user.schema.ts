import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/users/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    index: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    minlength: 6,
  })
  password: string;

  @Prop({
    index: true
  })
  isDating: boolean;

  @Prop({
    default: Role.User
  })
  role: Role;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  latitudeDelta: number;

  @Prop()
  longitudeDelta: number;
}

export const UserSchema = SchemaFactory.createForClass(User);