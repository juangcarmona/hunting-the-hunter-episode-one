import _ from "lodash";
import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import Box from "../../Box";
import CircleButton from "../../CircleButton";
import Icon from "../../Icon";
import { Field } from "../Field";
import { FormInputProps } from "../Form";

export interface InputProps<T extends object = any> extends FormInputProps {
    label?: string;
    description?: string;
    rightLabel?: string;
    buttonIcon?: string;
    rightDecoration?: React.ReactNode;
    register?: UseFormRegister<T>;
    errors?: FieldErrors<T>;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    onButtonClick?: Function;
    borderRadius?: number;
    backgroundColor?: string;
    isOverlapped?: boolean;
}

export const Input: React.FC<React.PropsWithChildren<InputProps>> = ({
    label,
    description,
    rightLabel,
    buttonIcon,
    rightDecoration,
    register,
    errors,
    inputProps,
    borderRadius = 3,
    backgroundColor,
    isOverlapped,
}) => {
    return (
        <StyledField
            {...{
                label,
                description,
                rightLabel,
                $buttonIcon: buttonIcon,
                isOverlapped,
            }}
            readOnly={inputProps?.readOnly}
            error={_.get(errors, inputProps.name!)?.message}
            $borderRadius={borderRadius}
            isSet={false}
            backgroundColor={backgroundColor}
        >
            {inputProps.prefix && (
                <FieldPrefix>{inputProps.prefix}</FieldPrefix>
            )}

            <input
                {...inputProps}
                {...(register != null
                    ? register(inputProps.name!, {
                          valueAsNumber: inputProps?.type === "number",
                      })
                    : {})}
                //for some reason onBlur is not working spreading Input props, this way it works (shrug)
                onBlur={inputProps.onBlur}
                tabIndex={inputProps.tabIndex}
                style={{ marginTop: isOverlapped ? "-25px" : "0" }}
            />

            <Box position="absolute" right={2}>
                {rightDecoration}
            </Box>

            {buttonIcon && (
                <CircleButton outline borderless small>
                    <Icon icon={buttonIcon} />
                </CircleButton>
            )}
        </StyledField>
    );
};

const StyledField = styled(Field)<{
    $borderRadius: number;
    $buttonIcon?: string;
    backgroundColor?: string;
}>`
    position: relative;
    width: 100%;

    input {
        border-radius: ${({ theme, $borderRadius }) =>
            $borderRadius < theme.radii.length
                ? theme.radii[$borderRadius]
                : $borderRadius}px;
        border: 2px solid ${({ theme }) => theme.colors.muted};
        padding: 10px 14px;
        height: 100%;
        padding-right: ${({ $buttonIcon }) =>
            $buttonIcon ? "48px" : "initial"};
        background-color: ${({ backgroundColor }) => backgroundColor};
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            appearance: none !important;
        }

        &[type="number"] {
            appearance: textfield;
            -moz-appearance: textfield;
        }
        &:focus-within {
            border-color: ${({ theme }) => theme.colors.accent};
        }
    }

    ${CircleButton} {
        position: absolute;
        width: 32px;
        height: 32px;
        flex: 0 0 32px;

        right: 8px;
    }
`;

const FieldPrefix = styled.span`
    white-space: nowrap;
`;
