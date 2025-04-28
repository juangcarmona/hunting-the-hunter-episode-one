import { useWeb3Auth } from "@/providers/Web3AuthProvider";
import { chainState } from "@/state/minting";
import { Chain } from "@/types/Chains";
import "@rainbow-me/rainbowkit/styles.css";
import { useConnex } from "@vechain/dapp-kit-react";
import { ethers } from "@vechain/ethers";
import {
    ADAPTER_EVENTS,
    WALLET_ADAPTERS,
    WalletInitializationError,
    WalletLoginError,
} from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { LOGIN_PROVIDER_TYPE } from "@web3auth/openlogin-adapter";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { Transaction, secp256k1 } from "thor-devkit";

const Web3AuthVechainContext = createContext({
    web3AuthVechain: {} as Web3AuthService | null,
    isConnected: null as boolean | null,
});

class Web3AuthService {
    constructor(
        private readonly web3Auth: Web3AuthNoModal,
        private readonly thor: any,
    ) {}

    async login(email: string) {
        await this.web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: "email_passwordless",
            extraLoginOptions: {
                login_hint: email,
            },
        });
    }

    async logout() {
        return this.web3Auth.logout().catch((error) => {
            if (!(error instanceof WalletLoginError)) {
                throw error;
            }
        });
    }

    get isConnected() {
        return this.web3Auth.connected;
    }

    addOnLoginListener(handler: (...args: any) => void) {
        this.web3Auth.on(ADAPTER_EVENTS.CONNECTED, handler);
    }

    addOnLogoutListener(handler: (...args: any) => void) {
        this.web3Auth.on(ADAPTER_EVENTS.DISCONNECTED, handler);
    }

    removeOnLoginListener(handler: (...args: any) => void) {
        this.web3Auth.off(ADAPTER_EVENTS.CONNECTED, handler);
    }

    removeOnLogoutListener(handler: (...args: any) => void) {
        this.web3Auth.off(ADAPTER_EVENTS.DISCONNECTED, handler);
    }

    async getUserInfo() {
        return await this.web3Auth.getUserInfo();
    }

    async getLoginProvider() {
        try {
            const user = await this.web3Auth.getUserInfo();
            return user.typeOfLogin as LOGIN_PROVIDER_TYPE;
        } catch (error) {
            if (error instanceof WalletLoginError) {
                return undefined;
            } else {
                throw error;
            }
        }
    }
    async signTransaction(clauses: any[]) {
        const { address, privateKey } = await this.getWallet();
        const gas = await this.estimateGas(clauses);

        const transaction = new Transaction({
            chainTag: 74,
            blockRef: this.thor.status.head.id.slice(0, 18),
            expiration: 500,
            clauses: clauses as Transaction.Clause[],
            gas,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: Math.floor(Date.now() / 1000),
            reserved: {
                // Enable the fee delegation feature.
                features: 1,
            },
        });

        const signingHash = transaction.signingHash();

        const originSignature = secp256k1.sign(
            signingHash,
            Buffer.from(privateKey.slice(2), "hex"),
        );

        const sponsorSignature = await this.delegateTransaction(
            transaction,
            address,
            "https://sponsor.vechain.energy/by/15",
        );

        transaction.signature = Buffer.concat([
            originSignature,
            sponsorSignature,
        ]);

        const signedTransaction = `0x${transaction.encode().toString("hex")}`;

        const txRes = await fetch(`https://node.vechain.energy/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ raw: signedTransaction }),
        });

        const { id } = await txRes.json();

        return { txid: id as string, signer: address };
    }

    private async delegateTransaction(
        transaction: Transaction,
        origin: string,
        delegationUrl: string,
    ) {
        const raw = `0x${transaction.encode().toString("hex")}`;

        const res = await fetch(delegationUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin, raw }),
        });

        const { signature, error } = await res.json();

        // Sponsorship was rejected.
        if (error) {
            throw new Error(error);
        }

        return Buffer.from(signature.substr(2), "hex");
    }

    async getWallet() {
        const request = { method: "private_key" };
        const privateKey = await this.web3Auth.provider!.request(request);
        return new ethers.Wallet(privateKey as string);
    }

    private async estimateGas(clauses: any) {
        let explainer = this.thor.explain(clauses);

        const output = await explainer.execute();
        const executionGas = output.reduce(
            (sum: any, out: any) => sum + out.gasUsed,
            0,
        );

        const intrinsicGas = Transaction.intrinsicGas(
            clauses as Transaction.Clause[],
        );

        const leeway = executionGas > 0 ? 10000000 : 0;

        return intrinsicGas + executionGas + leeway;
    }
}

export function useWeb3AuthVechain() {
    return useContext(Web3AuthVechainContext);
}

export default function Web3AuthVechainProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { web3Auth } = useWeb3Auth();
    const { thor } = useConnex();
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [web3AuthInstance, setWeb3AuthInstance] =
        useState<Web3AuthNoModal | null>(null);
    const connectedChain = useRecoilValue(chainState);

    const web3AuthService = useMemo(() => {
        return web3AuthInstance && thor
            ? new Web3AuthService(web3AuthInstance, thor)
            : null;
    }, [thor, web3AuthInstance]);

    useEffect(() => {
        if (!web3AuthService) {
            return;
        }

        setIsConnected(web3AuthService.isConnected);

        const handleLogin = () => {
            setIsConnected(true);
        };

        const handleLogout = () => {
            setIsConnected(false);
        };
        web3AuthService.addOnLoginListener(handleLogin);
        web3AuthService.addOnLogoutListener(handleLogout);

        return () => {
            web3AuthService.removeOnLoginListener(handleLogin);
            web3AuthService.removeOnLogoutListener(handleLogout);
        };
    }, [web3AuthService]);

    useEffect(() => {
        if (connectedChain === Chain.VECHAIN) {
            web3Auth
                .init()
                .then(() => {
                    setWeb3AuthInstance(web3Auth);
                })
                .catch((err) => {
                    if (err instanceof WalletInitializationError)
                        console.warn(err);
                    else throw err;
                });
        } else {
            setWeb3AuthInstance(null);
        }
    }, [connectedChain, web3Auth]);
    return (
        <Web3AuthVechainContext.Provider
            value={{
                web3AuthVechain: web3AuthService,
                isConnected,
            }}
        >
            {children}
        </Web3AuthVechainContext.Provider>
    );
}
