import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
    return `${args.property}는 ${args.constraints[0]}~${args.constraints[1]}사이여야 합니다.`;
};
