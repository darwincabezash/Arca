export class GlobalDataService {
    private static serverLocal: RequestInfo = "http://localhost:3000/graphql";
    private static serverPro: RequestInfo = "https://arca-server.vercel.app/graphql";
    public static val:Number=0;
    static getServer(){
        return this.serverPro;
    }
}