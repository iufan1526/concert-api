import { ValidationArguments } from 'class-validator';

export const emptyValidationMessage = (args: ValidationArguments) => {
    return `${args.property}는 필수값 입니다!!`;
};
