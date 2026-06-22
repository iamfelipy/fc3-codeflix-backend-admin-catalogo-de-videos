import { SearchValidationError } from '@core/shared/domain/validators/validation.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { union } from 'lodash';

@Catch(SearchValidationError)
export class SearchValidationErrorFilter implements ExceptionFilter {
  catch(exception: SearchValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(422).json({
      statusCode: 422,
      error: 'Search Validation Error',
      message: union(
        ...exception.error.reduce(
          (acc, error) =>
            // [[error]] de fato gera um array de arrays, mas como concat é usado, esses subarrays são “desembrulhados” e todos os elementos viram parte do array principal, então o resultado final é sempre um array de strings. Por isso a saída nunca fica como [["erro1"], ["erro2"]], mas sim ["erro1", "erro2"].
            acc.concat(
              //@ts-expect-error - error can be string
              typeof error === 'string'
              ? [[error]]
              : [
                  // Se error for { field1: ['msg1', 'msg2'], field2: ['msg3'] }, então Object.values(error) será [ ['msg1', 'msg2'], ['msg3'] ].
                  Object.values(error).reduce(
                    (acc, error) => acc.concat(error),
                    [] as string[],
                  ),
                ],
            ),
          [] as string[],
        ),
      ),
    });
  }
}