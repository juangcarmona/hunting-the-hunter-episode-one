import { theme } from "@/styles/theme";
import { useMemo } from "react";
import styled from "styled-components";
import Icon from "./Icon";

interface PaginationProps {
    page: number;
    totalPages: number;
    total?: number;
    setPage: (page: number) => void;
}

const PAGES_SHOWN = 2;

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    setPage,
    total,
}) => {
    const minPage = useMemo(() => Math.max(page - PAGES_SHOWN, 1), [page]);
    const maxPage = useMemo(
        () => Math.min(page + PAGES_SHOWN, totalPages),
        [page, totalPages],
    );

    return (
        <Container>
            {total ? (
                <span>
                    <strong>{total} items</strong>
                </span>
            ) : null}
            <Icon
                icon="arrow-left"
                onClick={() => setPage(Math.max(page - 1, 1))}
                style={{
                    color:
                        page == minPage ? `${theme.colors.muted}` : "inherit",
                    cursor: page == minPage ? "default" : "pointer",
                }}
            />
            {Array.from({ length: maxPage - minPage + 1 }, (_, i) => {
                const p = minPage + i;
                return (
                    <span
                        key={p}
                        style={{
                            fontWeight: p == page ? "bold" : "normal",
                            cursor: p == page ? "default" : "pointer",
                            background:
                                p == page
                                    ? `${theme.colors.primaryLight30}`
                                    : "inherit",

                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: p == page ? "none" : "1px solid lightgrey",
                        }}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </span>
                );
            })}

            <Icon
                icon="arrow-right"
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                style={{
                    color:
                        page == maxPage ? `${theme.colors.muted}` : "inherit",
                    cursor: page == maxPage ? "default" : "pointer",
                }}
            />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 10px;

    i {
        cursor: pointer;
    }
`;

export default Pagination;
