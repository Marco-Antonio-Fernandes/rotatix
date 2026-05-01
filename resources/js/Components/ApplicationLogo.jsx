export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="18 94"
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                opacity="0.35"
            />
            <circle
                cx="24"
                cy="24"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="52 36"
                strokeLinecap="round"
                transform="rotate(55 24 24)"
            />
            <circle
                cx="24"
                cy="24"
                r="5"
                fill="currentColor"
                opacity="0.9"
            />
        </svg>
    );
}
