import {
  CanvasSignatureAdapter,
  TopazExtLiteAdapter,
  type ISignatureAdapter,
} from '@felipealexandre/signature-lib';

export type MetodoAssinatura = 'canvas' | 'topaz' | 'topazextlite' | 'touchscreen';

export function getAdapterByMetodo(metodo: string): ISignatureAdapter {
  switch (metodo) {
    case 'canvas':
      return new CanvasSignatureAdapter();
    case 'topazextlite':
      return new TopazExtLiteAdapter();
    default:
      return new CanvasSignatureAdapter();
  }
}
