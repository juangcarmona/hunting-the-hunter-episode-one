import { CreateProjectRequestDto } from "@/dtos/projects.dto";
import { ProjectsService } from "@/services/ProjectsService";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import Modal from "../common/Modal";
import Text from "../common/Text";

interface ModalNewProjectProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
}

const validationSchema = yup.object().shape({
    name: yup.string().required(),
}) as any;

const ModalNewProject: React.FC<ModalNewProjectProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const { mutate } = useSWRConfig();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "all",
        resolver: yupResolver(validationSchema),
    });
    const isValid = Object.keys(errors).length === 0;

    const handleFormSubmit = async (data: CreateProjectRequestDto) => {
        try {
            await ProjectsService.create(data);
            mutate("/projects");
        } catch (error) {
            console.error(error);
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} hasCloseButton>
            <Text as="h1" textAlign="center" variant="bodyBold1" mt={20}>
                Create a project
            </Text>
            <Text my={2}>Enter a name for your new project</Text>
            <form
                onSubmit={handleSubmit(
                    handleFormSubmit as SubmitHandler<FieldValues>,
                )}
            >
                <Input
                    errors={errors}
                    inputProps={{
                        type: "name",
                        name: "name",
                        placeholder: "Project name",
                    }}
                    register={register}
                />

                <Flex justifyContent="end" mt={4} rowGap={3}>
                    <Button
                        outline
                        onClick={() => {
                            setValue("name", "");
                            setIsOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid}>
                        Create
                    </Button>
                </Flex>
            </form>
        </Modal>
    );
};

export default ModalNewProject;
