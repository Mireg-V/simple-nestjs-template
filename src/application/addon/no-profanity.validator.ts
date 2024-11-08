import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { words } from './profanity.data';

export function NoProfanity(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'containsNoProfanity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return !words.some(word => value.toLowerCase().includes(word));
        },
        defaultMessage(args: ValidationArguments) {
          return 'The text contains inappropriate language.';
        }
      },
    });
  };
}
