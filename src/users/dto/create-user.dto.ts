import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username!: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email!: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password!: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    isVerified?: boolean

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: true })
    isActive?: boolean
}
