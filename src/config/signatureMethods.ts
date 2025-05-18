import {
  SigPlusExtLiteAdapter,
  type ISignatureAdapter,
} from '@felipealexandre/signature-lib';

export type MetodoAssinatura = 'canvas' | 'topazextlite' | 'topaz' | 'touchscreen';

export function getAdapterByMetodo(metodo: string): ISignatureAdapter {
  switch (metodo) {
    default:
      return new SigPlusExtLiteAdapter();
  }
}
