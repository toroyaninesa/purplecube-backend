import { Trim } from 'class-sanitizer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import ERole from './role/role.enum';

export class RegisterDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsEnum(ERole)
  public readonly role: ERole;

  @IsString()
  public readonly name: string;

  @IsString()
  public readonly surname: string;
}

export class LoginDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}
