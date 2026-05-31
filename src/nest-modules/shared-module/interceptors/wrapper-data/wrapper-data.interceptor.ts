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
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      // !body é para não interferir em outros controllers que retornam vazio
      // para os outros casos forçamos data: body
      .pipe(map((body) => (!body || 'meta' in body ? body : { data: body })));
  }
}