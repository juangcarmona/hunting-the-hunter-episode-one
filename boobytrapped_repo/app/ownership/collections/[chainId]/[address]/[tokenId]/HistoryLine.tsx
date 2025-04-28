import React from "react";
import styled from "styled-components";

export const HistoryLine: React.FC = () => {
    return (
        <HistoryLineContainer>
            <div className="circle" />
            <div className="line" />
        </HistoryLineContainer>
    );
};

const HistoryLineContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 20px 20px 0;

    @media (max-width: 600px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 15px 10px 0;
    }

    .circle {
        width: 10px;
        height: 10px;
        background: #aaa;
        border-radius: 50%;
        margin: 0 10px 0 0;

        @media (max-width: 600px) {
            width: 8px;
            height: 8px;
            margin: 0 0 10px 0;
        }
    }

    .line {
        width: 100%;
        height: 2px;
        background: #aaa;

        @media (max-width: 600px) {
            height: 100%;
            width: 2px;
            padding: 0 0 10px 0;
        }
    }
`;
