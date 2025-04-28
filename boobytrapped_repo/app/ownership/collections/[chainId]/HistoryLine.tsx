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
    flex: 1;
    padding: 0 10px;

    .circle {
        width: 10px;
        height: 10px;
        background: #aaa;
        border-radius: 50%;
        margin: 0 10px 0 0;
    }

    .line {
        width: 100%;
        height: 2px;
        background: #aaa;
    }
`;
