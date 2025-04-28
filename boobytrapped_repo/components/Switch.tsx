import { useState } from "react";
import styled from "styled-components";

interface SwitchProps {
    value?: boolean;
    onChange: (value: boolean) => void;
    size?: number;
}

const Switch: React.FC<SwitchProps> = ({ value, onChange, size = 24 }) => {
    const [selected, setSelected] = useState<boolean>(!!value);

    return (
        <Container
            size={size}
            selected={selected}
            onClick={() => {
                if (onChange) onChange(!selected);
                setSelected(!selected);
            }}
        >
            <Sphere size={size} />
        </Container>
    );
};

const Container = styled.div<{ size: number; selected?: boolean }>`
    border-radius: 9999px;
    background: #e6e6e6;
    width: ${({ size }) => `${size * 2 + 4}`}px;
    height: ${({ size }) => `${size + 4}`}px;
    padding: 2px;
    cursor: pointer;

    display: flex;
    justify-content: ${({ selected }) =>
        selected ? "flex-end" : "flex-start"};
`;

const Sphere = styled.div<{ size: number }>`
    background: #3772ff;
    border-radius: 9999px;
    height: ${({ size }) => `${size}`}px;
    width: ${({ size }) => `${size}`}px;
`;

export default Switch;
