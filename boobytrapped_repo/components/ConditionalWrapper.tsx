import React from "react";

interface ConditionalWapperProps {
    isRendered: boolean;
    wrapper(children: React.ReactElement): React.ReactElement;
    children: React.ReactElement;
}

const ConditionalWrapper: React.FC<
    React.PropsWithChildren<ConditionalWapperProps>
> = ({ isRendered, wrapper, children }) =>
    isRendered ? wrapper(children) : children;

export default ConditionalWrapper;
