"use client";
import LoaderComponent from "@/app/ownership/collections/[chainId]/[address]/LoaderComponent";
import { convertToEthereum } from "@/helpers/convertToEthereum";
import { convertToNFT } from "@/helpers/convertToNFT";
import { getNFTsForOwner } from "@/helpers/getNFTsForOwner";
import useAlchemySdk from "@/hooks/useAlchemySdk";
import { Ecosystem } from "@/hooks/useConnect";
import useConnectedChain from "@/hooks/useConnectedChain";
import useEthereum from "@/hooks/useEthereum";
import useVechain from "@/hooks/useVechain";
import { GET_TOKENS } from "@/lib/graphql/getTokens";
import { Chain } from "@/types/Chains";
import { eLoginType } from "@/types/eLoginType";
import { tCollection } from "@/types/tCollection";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NftOrdering } from "alchemy-sdk";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styled from "styled-components";
import PageContentTitle from "../common/PageContentTitle";
import CollectionCard from "./CollectionCard";

const OwnershipCollectionsContent = () => {
    const { getOwnedCollections: getVechainOwnedCollections } = useVechain({
        ecosystem: Ecosystem.VECHAIN,
    });

    const { address, loginType } = useConnectedChain();
    const [loading, setLoading] = useState<boolean>(false);

    const { getOwnedCollections: getEthOwnedCollections } = useEthereum({
        chainId: 1,
    });

    const { getOwnedCollections: getMaticOwnedCollections } = useEthereum({
        chainId: 137,
    });

    const [collections, setCollections] = useState<tCollection[]>([]);

    const alchemySdk = useAlchemySdk();

    useEffect(() => {
        (async () => {
            if (!address) {
                return;
            }

            setLoading(true);

            let collections1: tCollection[] = [];

            try {
                if (
                    loginType === eLoginType.EVM ||
                    loginType === eLoginType.EMAIL
                ) {
                    const promise1 = getEthOwnedCollections(address);
                    const promise2 = getMaticOwnedCollections(address);
                    const values = await Promise.all([promise1, promise2]);
                    collections1 = [...values[0], ...values[1]];
                }

                if (
                    loginType === eLoginType.VECHAIN ||
                    loginType === eLoginType.EMAIL
                ) {
                    const collections2 =
                        await getVechainOwnedCollections(address);
                    collections1 = [...collections1, ...collections2];
                }
            } catch (ex) {
                console.error(ex);
            }

            setCollections(collections1);
            setLoading(false);

            const apolloClient = new ApolloClient({
                uri: "https://mainnet.api.worldofv.art/graphql",
                cache: new InMemoryCache(),
            });

            collections1.forEach(async (c) => {
                try {
                    if (c.chainId === 1 || c.chainId === 137) {
                        const { ownedNfts } = await getNFTsForOwner(
                            alchemySdk[
                                c.chainId === 1 ? Chain.ETHEREUM : Chain.MATIC
                            ],
                            address,
                            {
                                orderBy: NftOrdering.TRANSFERTIME,
                                contractAddresses: [c.address as string],
                            },
                        );

                        const nfts = convertToEthereum(ownedNfts);
                        setCollections((oldState) => {
                            const newState = [...oldState];
                            const i = newState.findIndex(
                                (c1) => c1.address === c.address,
                            );
                            newState[i] = {
                                ...newState[i],
                                nfts,
                            };
                            return newState;
                        });
                    } else if (c.chainId === 100009) {
                        const result = await apolloClient.query({
                            query: GET_TOKENS,
                            variables: {
                                ownerAddress: address,
                                smartContractAddress: c.address,
                                page: 1,
                                perPage: 100,
                            },
                        });

                        const nfts = convertToNFT(result?.data);
                        setCollections((oldState) => {
                            const newState = [...oldState];
                            const i = newState.findIndex(
                                (c1) => c1.address === c.address,
                            );
                            newState[i] = {
                                ...newState[i],
                                nfts,
                            };
                            return newState;
                        });
                    }
                } catch (ex) {
                    console.error(ex);
                }
            });
        })();
    }, [address, loginType]);

    return (
        <Main>
            <PageContentTitle>Your Collections</PageContentTitle>
            {loading ? (
                <LoaderComponent />
            ) : (
                <>
                    <FlexContainer>
                        <CardGroup>
                            {collections.map((collection) => (
                                <CollectionCard
                                    key={collection.address}
                                    name={collection.name}
                                    address={collection.address}
                                    nfts={collection.nfts}
                                    chainId={collection.chainId}
                                />
                            ))}
                        </CardGroup>
                    </FlexContainer>
                </>
            )}
        </Main>
    );
};

const Main = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;
`;

const CardGroup = styled.div`
    padding: 20px 0 0 0;
    display: flex;
    position: relative;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: 600px) {
        justify-content: center;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
`;

export default OwnershipCollectionsContent;
