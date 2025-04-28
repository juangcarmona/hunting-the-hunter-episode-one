import { Title } from "@/app/templates/common";
import { ProjectsService } from "@/services/ProjectsService";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import * as yup from "yup";
import Box from "../common/Box";
import Button from "../common/Button";
import { Input } from "../common/FormInputs/Input";
import Modal from "../common/Modal";
import Spacer from "../common/Spacer";

interface NewProjectModalProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    newProjectSelected: (project: any) => void;
    projects: any;
}

const validationSchema = yup.object().shape({
    newProject: yup.string().required(),
});

const NewProjectModal: React.FC<NewProjectModalProps> = ({
    isOpen,
    setIsOpen,
    newProjectSelected,
    projects,
}) => {
    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const { mutate } = useSWRConfig();
    const onSubmit = async (values: FieldValues) => {
        if (projects?.some((obj: any) => obj.name === values.newProject)) {
            toast.error("There is already a project with that name");
        } else {
            const result = await ProjectsService.create({
                name: values.newProject,
            });
            const project = {
                label: result.data?.json.name,
                value: result.data?.json.id,
            };
            newProjectSelected(project);
            mutate("/projects");
            reset();
            setIsOpen(false);
        }
    };
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <Box height={250} position="relative">
                <Button
                    outline
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 0,
                        padding: "10px 20px",
                        borderRadius: "50%",
                        fontWeight: "600",
                    }}
                >
                    X
                </Button>
                <Spacer y size={40} />
                <Title> Create a new Project </Title>
                <Spacer y size={20} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        inputProps={{
                            name: "newProject",
                            placeholder: "e.g. My Project",
                        }}
                        register={register}
                    />
                    <Spacer y size={20} />
                    <Box width={200} ml={80}>
                        <Button fullWidth type="submit">
                            Create
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default NewProjectModal;
