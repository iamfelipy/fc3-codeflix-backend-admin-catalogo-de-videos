import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';
import { EntityValidationError } from '../../../core/shared/domain/validators/validation.error';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: union(
        ...exception.error.reduce(
          (acc, error) =>
            // [[error]] de fato gera um array de arrays, mas como concat é usado, esses subarrays são “desembrulhados” e todos os elementos viram parte do array principal, então o resultado final é sempre um array de strings. Por isso a saída nunca fica como [["erro1"], ["erro2"]], mas sim ["erro1", "erro2"].
            acc.concat(
              typeof error === 'string' ? [[error]] : Object.values(error),
            ),
          [],
        ),
      ),
    });
  }
}