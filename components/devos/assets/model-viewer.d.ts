declare namespace JSX {
    interface IntrinsicElements {
        "model-viewer": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement> & {
                src?: string;
                "camera-controls"?: boolean;
                "auto-rotate"?: boolean;
                exposure?: string;
                "shadow-intensity"?: string;
                "environment-image"?: string;
            },
            HTMLElement
        >;
    }
}