import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import {
    Control,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import styled from "styled-components";
import Assign from "./Assign";
import Details from "./Details";
import History from "./History";
import PersonalizedMessage from "./PersonalizedMessage";
import ProductData from "./ProductData";
import Values from "./Values";

interface TemplateFormProps<T extends object = any> {
    step: Number;
    control: Control<T>;
    register: UseFormRegister<T>;
    isValid: boolean;
    setStep: (step: number) => void;
    values: FieldValues;
    setValue: UseFormSetValue<any>;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
    control,
    isValid,
    register,
    setStep,
    step,
    setValue,
    values,
}) => {
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    return (
        <Container style={{ width: isMobile ? "90%" : undefined }}>
            <EditPhygital style={{ width: isMobile ? "100%" : "500px" }}>
                {step === 1 && (
                    <Details
                        control={control}
                        register={register}
                        isValid={isValid}
                        setStep={setStep}
                        setValue={setValue}
                        values={values}
                    />
                )}
                {step === 2 && (
                    <PersonalizedMessage
                        control={control}
                        setStep={setStep}
                        isValid={isValid}
                        setValue={setValue}
                        values={values}
                        register={register}
                        subFormOpened={values.personalizedMessage}
                    />
                )}
                {step === 3 && (
                    <ProductData
                        setStep={setStep}
                        isValid={isValid}
                        control={control}
                        register={register}
                        subFormOpened={values.traits?.length > 0}
                    />
                )}
                {step === 4 && (
                    <History
                        setStep={setStep}
                        control={control}
                        isValid={isValid}
                        register={register}
                        subFormOpened={values.history?.length > 0}
                    />
                )}
                {step === 5 && (
                    <Values
                        setStep={setStep}
                        control={control}
                        isValid={isValid}
                        values={values}
                        setValue={setValue}
                        subFormOpened={values.values?.length > 0}
                    />
                )}
                {step === 6 && (
                    <Assign
                        register={register}
                        setStep={setStep}
                        isValid={isValid}
                        values={values}
                        setValue={setValue}
                        control={control}
                    />
                )}
            </EditPhygital>
        </Container>
    );
};
const Container = styled.div`
    overflow: hidden;
    border-radius: 30px;
`;
const EditPhygital = styled.div`
    background-color: white;
    border: 1px solid black;
    height: 80vh;
    padding: 20px;
    overflow-y: scroll;
    scrollbar-color: grey transparent;
`;
export default TemplateForm;
