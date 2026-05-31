import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should wrapper with data key', async () => {
    expect(interceptor).toBeDefined();
    // obs$: convenção da comunidade ao nomear um observable
    const obs$ = interceptor.intercept({} as any, {
      // of é uma função do RxJS que cria um Observable que emite o valor passado (neste caso, { name: 'test' }). Serve para simular valores assíncronos em testes.
      handle: () => of({ name: 'test' }),
    });

    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  it('should not wrapper when meta key is present', async () => {
    expect(interceptor).toBeDefined();
    const data = { data: { name: 'test' }, meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(data),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual(data);
  });
});