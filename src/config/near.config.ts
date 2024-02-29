import { Near, keyStores, KeyPair, connect, WalletConnection, InMemorySigner } from "near-api-js";

class NearCofig {
    public _network: any;

    constructor(network: any){
        this._network = network
    }

    connect = async () => {
        return await connect({
            networkId: `${this._network}`,
            nodeUrl: `https://rpc.${this._network}.near.org`,
            deps: { keyStore: new keyStores.InMemoryKeyStore() },
            helperUrl: `https://helper.${this._network}.near.org`,
        });
    }
}

export default NearCofig;