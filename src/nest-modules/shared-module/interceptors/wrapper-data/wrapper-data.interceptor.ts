import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs'; //reactive x

// pode receber um serviço do nest no contructor, mas teria que carregar em algum modulo o WrapperDataIncerceptor
@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  /*
    Pergunta:
    se o interceptor atua tanto no inicio como no fim, onde diz aqui que deve ser executado no fim?

    Resposta:
    O uso de next.handle().pipe(map(...)) mostra que o interceptor manipula a resposta após o controller executá-la, ou seja, atua no fim. O operador pipe opera sobre o resultado retornado, não sobre o início da requisição.
  */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      // interceptors do NestJS usam programação reativa (RxJS) para permitir manipulação assíncrona da resposta; o handle fornece um Observable para compor transformações ou efeitos antes de enviar a resposta final.
      // next.handle() retorna um Observable da resposta do controller. O pipe(map(...)) permite transformar essa resposta depois que o controller executou, antes de enviar ao cliente.
      .handle()
      // !body é para não interferir em outros controllers que retornam vazio
      // para os outros casos forçamos data: body
      .pipe(map((body) => (!body || 'meta' in body ? body : { data: body })));
  }
}