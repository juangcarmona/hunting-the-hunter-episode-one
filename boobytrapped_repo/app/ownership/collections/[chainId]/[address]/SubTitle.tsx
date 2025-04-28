/* eslint-disable @next/next/no-img-element */
import React from "react";
import styled from "styled-components";

type tSubTitleProps = {
    icon: string;
    title: string;
    onChange: (v: boolean) => void;
    collapsed: boolean;
};

export const SubTitle: React.FC<tSubTitleProps> = ({
    icon,
    title,
    onChange,
    collapsed,
}) => {
    return (
        <SubTitleContainer onClick={() => onChange(!collapsed)}>
            <div className="icon">
                <img src={icon} alt={title} />
            </div>
            <h2 className="text">{title}</h2>
            <div className="collapsed-button">
                <img
                    src={
                        collapsed
                            ? "/images/history_view_button_icon.png"
                            : "/images/history_disable_button_icon.png"
                    }
                    alt=""
                    className="history-title-disable-button-icon"
                />
            </div>
        </SubTitleContainer>
    );
};

const SubTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    cursor: pointer;

    .icon {
        display: flex;
        justify-content: center;
        margin: 0 10px 0 0;

        img {
            width: 27px;
        }
    }

    .text {
        font-size: 13px;
        margin: 0 auto 0 0;
        @media (max-width: 600px) {
            font-size: 13px;
        }
    }
`;
