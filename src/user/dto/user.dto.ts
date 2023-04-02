import {IsEnum, IsOptional, IsString} from "class-validator";
import {EnumGender} from "../enums/gender.enum";

export class UserDto {
  @IsOptional()
  @IsString()
  username: string

  @IsOptional()
  @IsString()
  country: string

  @IsOptional()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  birthday: string

  @IsOptional()
  @IsEnum(EnumGender)
  gender: string

  @IsOptional()
  avatar: any
}