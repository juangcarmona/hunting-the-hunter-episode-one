import styled from "styled-components";
const LoaderComponent = () => {
    return (
        <>
            <Loader>
                Loading...
                <div className="loader"></div>
            </Loader>
        </>
    );
};

const Loader = styled.div`
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    color: #777e90;
    margin-top: -100px;

    .loader {
        width: 20px;
        height: 20px;
        border: 3px solid #777e90;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
export default LoaderComponent;
