import React from "react";
import styled from "styled-components";

const Checkbox = React.forwardRef(
    (
        {
            children,
            ...props
        }: React.HTMLAttributes<HTMLInputElement> & {
            value?: any;
            containerStyle?: React.CSSProperties;
        },
        ref: React.Ref<HTMLInputElement>,
    ) => (
        <Container style={props.containerStyle}>
            <Input type="checkbox" ref={ref} {...props} />

            <ContainerInner>
                <CheckboxSquare />

                <CheckboxText>{children}</CheckboxText>
            </ContainerInner>
        </Container>
    ),
);

Checkbox.displayName = "Checkbox";

const Container = styled.label`
    display: block;
    position: relative;
    cursor: pointer;
    width: fit-content;
`;

const CheckboxSquare = styled.span`
    position: relative;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    margin-right: 10px;
    border-radius: 2px;
    border: 1px solid black;
    transition: all 0.2s;

    &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        width: 8px;
        height: 8px;
        border-radius: 2px;
        background: black;
        transition: opacity 0.3s;
    }
`;

const ContainerInner = styled.span`
    display: flex;
    align-items: center;
`;

const Input = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    &:checked + ${ContainerInner} ${CheckboxSquare} {
        &:before {
            opacity: 1;
        }
    }
`;

const CheckboxText = styled.span`
    font-size: 16px;

    a,
    button {
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        text-decoration: underline;
    }

    button {
        appearance: none;
        border: none;
        background: none;
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
    }
`;

export default Checkbox;
