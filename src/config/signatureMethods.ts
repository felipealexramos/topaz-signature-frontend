import {
  CanvasSignatureAdapter,
  TopazSignatureAdapter,
  type ISignatureAdapter,
} from '@felipealexandre/signature-lib';

export type MetodoAssinatura = 'canvas' | 'topaz' | 'touchscreen';

export function getAdapterByMetodo(metodo: string): ISignatureAdapter {
  switch (metodo) {
    case 'canvas':
      return new CanvasSignatureAdapter('signature-canvas');
    case 'touchscreen':
      return new CanvasSignatureAdapter('signature-canvas');
    case 'topaz':
      return new TopazSignatureAdapter();
    default:
      return new CanvasSignatureAdapter('signature-canvas');
  }
}
