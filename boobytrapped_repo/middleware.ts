import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_ADMIN_HOSTS = ["app.wovlabs.com", "localhost:4444"];
const ALLOWED_CLIENTS_URL = [/\/a\//, /\/b\//];

const CUSTOM_DOMAIN_CHIP_URL_REGEX = [/\/a\//, /\/b\//];

export async function middleware(request: NextRequest) {
    const multiDomainFilterResponse = multiDomainFilter(request);
    if (multiDomainFilterResponse) return multiDomainFilterResponse;

    const customDomainFilterResponse = await customDomainFilter(request);
    if (customDomainFilterResponse) return customDomainFilterResponse;

    return NextResponse.next();
}

const customDomainFilter = async (request: NextRequest) => {
    const host = request.headers.get("host");
    if (!host) return undefined;

    // Only run this middleware for the provenance page
    if (!CUSTOM_DOMAIN_CHIP_URL_REGEX.some((url) => url.test(request.url))) {
        return undefined;
    }

    // Get the chip code
    const uri = request.url.split("/").pop();
    if (!uri) return undefined;

    const chipCode = uri.split("?")[0];
    if (!chipCode) return undefined;

    // Fetch the chip data
    const chipRequest = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/chips/${chipCode}`,
        {
            headers: {
                "Content-Type": "application/json",

                // This is needed to bypass the analytics
                "User-Agent": "NFC-Auth-App",
            },
        },
    );

    if (chipRequest.status === 200) {
        const chipData = await chipRequest.json();

        if (chipData?.customDomain) {
            if (request.url.includes(chipData.customDomain)) {
                return undefined;
            }

            // Replace current domain with custom domain
            return NextResponse.redirect(
                new URL(request.url.replace(host, chipData.customDomain)),
            );
        }
    }

    return undefined;
};

const multiDomainFilter = (request: NextRequest) => {
    const host = request.headers.get("host");
    if (!host) return undefined;

    if (ALLOWED_CLIENTS_URL.some((url) => url.test(request.url))) {
        return undefined;
    }

    if (
        ALLOWED_ADMIN_HOSTS.includes(host) ||
        host.startsWith("nfc-auth-frontend-git")
    ) {
        return undefined;
    }

    return NextResponse.redirect(
        new URL(`https://${ALLOWED_ADMIN_HOSTS[0]}`, request.url),
    );
};

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|images/|fonts/).*)",
    ],
};
