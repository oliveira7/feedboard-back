import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = response.statusCode;

        let message = '';
        switch (request.method) {
          case 'GET':
            message = 'Dados recuperados com sucesso';
            break;
          case 'POST':
            message = 'Dados criados com sucesso';
            break;
          case 'PUT':
          case 'PATCH':
            message = 'Dados atualizados com sucesso';
            break;
          case 'DELETE':
            message = 'Dados excluídos com sucesso';
            break;
          default:
            message = 'Operação realizada com sucesso';
        }

        if (statusCode >= 401) {
          message = 'Operação não autorizada';
        }

        if (statusCode === 404) {
          message = 'Nenhum dado encontrado';
        }

        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }
}
