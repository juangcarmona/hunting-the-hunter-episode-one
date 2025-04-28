export interface ClientProps {
    id: any;
    name: string;
    User: {
        id: string;
        email: string;
        enabled: boolean;
        createdAt: string;
    };
    customDomain: string | null;
}
