/** @type {import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement>} */
const ModelViewerProps = {
    alt: String,
    poster: String,
    src: String
};

if (typeof JSX !== 'undefined') {
    JSX.IntrinsicElements["model-viewer"] = ModelViewerProps;
}
