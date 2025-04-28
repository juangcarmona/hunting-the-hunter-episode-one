import styled from "styled-components";

const PageContentTitle: React.FC<React.PropsWithChildren<any>> = ({
    children,
}) => {
    return <ContentTitle>{children}</ContentTitle>;
};

const ContentTitle = styled.div`
    font-weight: 600;
    font-size: 18px;
    font-family: "Poppins", sans-serif;
    border-bottom: 1px solid #e5eaef;
    padding: 20px 16px;
`;

export default PageContentTitle;
