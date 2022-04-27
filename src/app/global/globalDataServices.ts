export class GlobalDataService {
  private static serverLocal: RequestInfo = 'http://localhost:3000/graphql';
  private static serverPro: RequestInfo =
    'https://arca-server.vercel.app/graphql';

  private static rutaImagenLocal: any = 'arca/images/';
  private static rutaImagenPro: any = 'arcaPro/images/';
  public static val: Number = 0;

  static getServer() {
    return this.serverPro;
  }

  static obtenerRutaImagenFirebase() {
    return this.rutaImagenPro;
  }
}