import { CHAINS } from "@/constants/chains";
import useBlockchain from "@/hooks/useBlockchain";
import { Ecosystem } from "@/hooks/useConnect";
import {
    Collection,
    chainState,
    mintingCollectionState,
} from "@/state/minting";
import { theme } from "@/styles/theme";
import { Chain } from "@/types/Chains";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Select } from "../common/FormInputs/Select";
import Loader from "../common/Loader";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import ExitConfirmationModal from "./ExitConfirmationModal";

const SelectCollection = () => {
    const router = useRouter();

    const setMintingCollection = useSetRecoilState(mintingCollectionState);
    const [collections, setCollections] = useState<Collection[]>([]);

    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [selectedCollection, setSelectedCollection] =
        useState<Collection | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const connectedChain = useRecoilValue(chainState);
    const ecosystem = useMemo(
        () =>
            connectedChain === Chain.VECHAIN
                ? Ecosystem.VECHAIN
                : Ecosystem.ETHEREUM,
        [connectedChain],
    );

    const chainId = useMemo(
        () =>
            CHAINS.find(
                (c) => c.name.toLowerCase() === connectedChain.toLowerCase(),
            )!.config.id,
        [connectedChain],
    );
    const { getCreatedCollections, createCollection } = useBlockchain({
        collectionAddress: selectedCollection?.value,
        ecosystem,
        chainId: Number(chainId),
    });
    const [isExitOpen, setIsExitOpen] = useState(false);

    useEffect(() => {
        if (getCreatedCollections) {
            getCreatedCollections(true).then((res) => {
                console.log({ res });
                setCollections(res || []);
            });
        }
    }, [getCreatedCollections]);

    const onSelectCollection = useCallback(
        (collection: Collection) => {
            setMintingCollection(collection);
            router.push(`select-chips`);
        },
        [router, setMintingCollection],
    );

    useEffect(() => {
        if (collections?.length) {
            setIsCreatingCollection(false);
        } else {
            setIsCreatingCollection(true);
        }
    }, [collections?.length]);

    const onCreateCollection = async () => {
        if (!selectedCollection?.label || !createCollection) {
            toast.error("Failed to create a new collection");
            return;
        }
        setIsLoading(true);
        try {
            const newCollectionAddress = await createCollection?.(
                selectedCollection?.label,
            );

            onSelectCollection({
                label: selectedCollection?.label,
                value: newCollectionAddress,
            });
        } catch (err) {
            toast.error("Failed to create a new collection");
            console.warn("Failed to create a new collection:", err);
        }
        setIsLoading(false);
    };

    return (
        <Flex flexDirection="column" columnGap={3} alignItems="end">
            <Button
                outline
                onClick={() => setIsExitOpen(true)}
                style={{ width: "30%" }}
            >
                Exit
            </Button>
            <Flex
                flexDirection="column"
                justifyContent="center"
                p={4}
                backgroundColor={theme.colors.white}
                borderRadius={10}
                width={600}
            >
                {!isCreatingCollection ? (
                    <>
                        <h1>Select Collection</h1>
                        <Spacer y size={4} />

                        <p>
                            Please select a collection you want to assign the
                            smart tag&#40;s&#41; to once they&lsquo;ve been
                            tokenized.
                        </p>

                        <Spacer y size={2} />

                        <Select
                            inputProps={{
                                name: "collection",
                                options: collections,
                                onChange: (collection: Collection) => {
                                    setSelectedCollection(collection);
                                },
                            }}
                        />

                        <Spacer y size={4} />

                        <Text variant="caption1" color={theme.colors.accent}>
                            Do you want to create a collection?
                            <CreateCollectionText
                                onClick={() => {
                                    setSelectedCollection(null);
                                    setIsCreatingCollection(true);
                                }}
                            >
                                Create it now
                            </CreateCollectionText>
                        </Text>

                        <Spacer y size={4} />
                    </>
                ) : (
                    <>
                        <h1>Create Collection</h1>
                        <Spacer y size={4} />

                        <p>Enter a name for your new collection</p>

                        <Spacer y size={2} />

                        <Input
                            inputProps={{
                                name: "collection",
                                placeholder: "e.g. My Collection",
                                value: selectedCollection?.label,
                                //disabled: newCollectionLoading, review this
                                onChange: (e) => {
                                    setSelectedCollection({
                                        label: e.target.value,
                                        value: undefined,
                                    });
                                },
                            }}
                        />

                        <Spacer y size={4} />
                    </>
                )}

                <Flex
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    rowGap={2}
                >
                    {isCreatingCollection && (
                        <>
                            <Button
                                outline
                                onClick={() => setIsCreatingCollection(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                disabled={
                                    !selectedCollection?.label?.length ||
                                    isLoading
                                }
                                onClick={onCreateCollection}
                            >
                                {isLoading ? <Loader /> : "Create Collection"}
                            </Button>
                        </>
                    )}
                    {!isCreatingCollection && (
                        <Button
                            disabled={!selectedCollection}
                            onClick={() =>
                                onSelectCollection(selectedCollection!)
                            }
                        >
                            Next
                        </Button>
                    )}
                </Flex>
            </Flex>
            {isExitOpen && (
                <ExitConfirmationModal setIsExitOpen={setIsExitOpen} />
            )}
        </Flex>
    );
};

const CreateCollectionText = styled.span`
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    margin-left: 5px;
    cursor: pointer;
`;

export default SelectCollection;
