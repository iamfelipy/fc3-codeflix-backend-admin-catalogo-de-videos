import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { NotFoundError } from '../../../core/shared/domain/errors/not-found.error';
//  Express é um framework para criar servidores HTTP em Node.js, facilitando o roteamento, manipulação de requisições e respostas.
import { Response } from 'express';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    // o host poderia ser websocket, mensageria, mas eu quero o do http
    const ctx = host.switchToHttp();
    // response é da do express, pois foi ativado como servidor http
    const response: Response = ctx.getResponse();

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}