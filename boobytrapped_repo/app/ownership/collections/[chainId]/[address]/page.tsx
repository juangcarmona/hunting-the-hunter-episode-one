"use client";
import Flex from "@/components/common/Flex";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import { convertToEthereum } from "@/helpers/convertToEthereum";
import { convertToNFT } from "@/helpers/convertToNFT";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import useAlchemySdk from "@/hooks/useAlchemySdk";
import { Ecosystem } from "@/hooks/useConnect";
import useConnectedChain from "@/hooks/useConnectedChain";
import useEthereum from "@/hooks/useEthereum";
import useVechain from "@/hooks/useVechain";
import { GET_TOKENS } from "@/lib/graphql/getTokens";
import { accessTokenState } from "@/state/accessToken";
import { reloadPage } from "@/state/reloadPage";
import { Chain } from "@/types/Chains";
import { tNFT } from "@/types/tNFT";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NftOrdering } from "alchemy-sdk";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import LoaderComponent from "./LoaderComponent";
import NFTCard from "./NFTCard";

const CollectionPage = () => {
    const { address, loginType } = useConnectedChain();
    const { chainId, address: collectionAddress } = useParams();
    const alchemySdk = useAlchemySdk();
    const [nfts, setNfts] = useState<tNFT[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [collectionName, setCollectionName] = useState<any>("");

    const { getCreatedCollections: getCreatedEvmCollections } = useEthereum({
        chainId: 1,
    });
    const { getCreatedCollections: getCreatedMaticCollections } = useEthereum({
        chainId: 137,
    });

    const { getCreatedCollections: getVechainCollections } = useVechain({
        ecosystem: Ecosystem.VECHAIN,
    });

    const [accessToken, setAccesToken] = useRecoilState(accessTokenState);
    const [currentUser, setCurrentUser] = useState<any>();
    const [reload, setReloadPage] = useRecoilState(reloadPage);

    useEffect(() => {
        if (!accessToken && address) {
            (async () => {
                try {
                    const getToken = await axios.post(
                        `${process.env.NEXT_PUBLIC_BE_URL}/auth/byWallet`,
                        { wallet: address },
                    );
                    setAccesToken(getToken.data.access_token);
                } catch (ex) {
                    console.error(ex);
                    setAccesToken("");
                }
            })();
        }
    }, [address]);

    useEffect(() => {
        (async () => {
            if (!address) {
                return;
            }
            const user = await getCurrentUser(address);
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        })();
    }, [address]);

    // set collection name
    useEffect(() => {
        (async () => {
            if (+chainId === 1) {
                const evmCollections = await getCreatedEvmCollections();
                setCollectionName(
                    evmCollections.find(
                        (c) => c.value?.toLowerCase() === collectionAddress,
                    )?.label,
                );
            } else if (+chainId === 137) {
                const maticCollections = await getCreatedMaticCollections();
                setCollectionName(
                    maticCollections.find(
                        (c) => c.value?.toLowerCase() === collectionAddress,
                    )?.label,
                );
            } else if (+chainId === 100009) {
                const vechainCollections = await getVechainCollections();
                setCollectionName(
                    vechainCollections?.find(
                        (c: any) =>
                            c.value?.toLowerCase() === collectionAddress,
                    )?.label,
                );
            }
        })();
    }, [
        getCreatedEvmCollections,
        getCreatedMaticCollections,
        getVechainCollections,
        chainId,
        collectionAddress,
    ]);

    // get evm nfts
    useEffect(() => {
        if (!address || !collectionAddress) {
            return;
        }

        (async () => {
            if (+chainId === 1 || +chainId === 137) {
                setLoading(true);

                try {
                    const { ownedNfts }: any = await alchemySdk[
                        +chainId === 1 ? Chain.ETHEREUM : Chain.MATIC
                    ].nft.getNftsForOwner(
                        // "0xC6C2414d4AB18668704340F25F2227F08142d69C" as string,
                        // "0xd9597f37d935be2a1386c4e773ef97937c72a874" as string,
                        address,
                        {
                            orderBy: NftOrdering.TRANSFERTIME,
                            contractAddresses: [collectionAddress as string],
                        },
                    );
                    setNfts(convertToEthereum(ownedNfts));
                } catch (ex) {
                    console.error(ex);
                }

                setLoading(false);
            } else if (+chainId === 100009) {
                setLoading(true);

                try {
                    const apolloClient = new ApolloClient({
                        uri: "https://mainnet.api.worldofv.art/graphql",
                        cache: new InMemoryCache(),
                    });

                    // components/somewhere.ts
                    const result = await apolloClient.query({
                        query: GET_TOKENS,
                        variables: {
                            ownerAddress: address,
                            smartContractAddress: collectionAddress,
                            page: 1,
                            perPage: 100,
                        },
                    });

                    setNfts(convertToNFT(result?.data));
                } catch (ex) {
                    console.error(ex);
                }

                setLoading(false);
            }
        })();
    }, [address, reload]);

    return (
        <Main>
            <PageContentTitle>
                <Flex alignItems="center">
                    <Link
                        href={`/ownership/collections/`}
                        className="redirect-icon-wrap"
                    >
                        <img
                            src="/images/direction_left_arrow.png"
                            alt=""
                            className="redirect-icon"
                        />
                    </Link>
                    <Spacer size={3} />
                    {collectionName}
                </Flex>
            </PageContentTitle>
            {loading ? (
                <LoaderComponent />
            ) : (
                <>
                    <FlexContainer>
                        <CardGroup>
                            {nfts?.map((nft) => (
                                <NFTCard
                                    key={nft.tokenId}
                                    label={nft.name}
                                    tokenId={nft.tokenId}
                                    image={nft.asset}
                                    address={nft.smartContractAddress}
                                    chainId={Number(chainId)}
                                    chipId={nft.chipId}
                                    currentUser={currentUser}
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

    .redirect-icon {
        width: 20px;
        height: 20px;

        @media (max-width: 600px) {
            width: 15px;
            height: 15px;
        }
    }

    .redirect-icon-wrap {
        width: 40px;
        height: 40px;
        background-color: rgb(231, 232, 238);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;

        &:hover {
            background-color: rgb(181, 190, 209);
        }

        @media (max-width: 600px) {
            width: 30px;
            height: 30px;
        }
    }
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

export default CollectionPage;
