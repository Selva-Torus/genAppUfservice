export const DeleteIcon = ({ width = "16", height = "16", fill = "black" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="1">
        <path
          d="M6.66406 7.3335V11.3335"
          stroke={fill}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33594 7.3335V11.3335"
          stroke={fill}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.66406 4.6665H13.3307"
          stroke={fill}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 4.6665H8H12V11.9998C12 13.1044 11.1046 13.9998 10 13.9998H6C4.89543 13.9998 4 13.1044 4 11.9998V4.6665Z"
          stroke={fill}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 3.33333C6 2.59695 6.59695 2 7.33333 2H8.66667C9.40307 2 10 2.59695 10 3.33333V4.66667H6V3.33333Z"
          stroke={fill}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const Management = ({
  fill = "black",
  width = "0.83vw",
  height = "0.83vw",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={fill == "black" ? "0.35" : "1"}>
        <path
          d="M8.00065 6.66634C9.47341 6.66634 10.6673 5.47243 10.6673 3.99967C10.6673 2.52691 9.47341 1.33301 8.00065 1.33301C6.52789 1.33301 5.33398 2.52691 5.33398 3.99967C5.33398 5.47243 6.52789 6.66634 8.00065 6.66634Z"
          stroke={fill}
          strokeWidth="1.2"
        />
        <path
          d="M8.00065 13.9998C10.578 13.9998 12.6673 12.8059 12.6673 11.3332C12.6673 9.86041 10.578 8.6665 8.00065 8.6665C5.42332 8.6665 3.33398 9.86041 3.33398 11.3332C3.33398 12.8059 5.42332 13.9998 8.00065 13.9998Z"
          stroke={fill}
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
};

export const Org = ({ fill = "black" }) => {
  return (
    <svg
      width="0.83vw"
      height="0.83vw"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        opacity={fill == "black" ? "0.35" : "1"}
        clipPath="url(#clip0_3291_44816)"
      >
        <path
          d="M14.6663 14.6665H1.33301"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M13.9997 14.6668V4.00016C13.9997 2.74308 13.9997 2.11454 13.6092 1.72402C13.2187 1.3335 12.5901 1.3335 11.333 1.3335H9.99967C8.7426 1.3335 8.11407 1.3335 7.72354 1.72402C7.4092 2.03838 7.34787 2.50698 7.33594 3.3335"
          stroke={fill}
          strokeWidth="1.2"
        />
        <path
          d="M10 14.6668V6.00016C10 4.74308 10 4.11454 9.60947 3.72402C9.21893 3.3335 8.5904 3.3335 7.33333 3.3335H4.66667C3.40959 3.3335 2.78105 3.3335 2.39053 3.72402C2 4.11454 2 4.74308 2 6.00016V14.6668"
          stroke={fill}
          strokeWidth="1.2"
        />
        <path
          d="M6 14.6665V12.6665"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M4 5.3335H8"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M4 7.3335H8"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M4 9.3335H8"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3291_44816">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const PlusIcon = ({
  width = "1.25vw",
  height = "1.25vw",
  fill = "black",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={fill == "black" ? "0.35" : "1"}>
        <rect
          x="-0.015"
          y="0.015"
          width="23.97"
          height="23.97"
          transform="matrix(-1 0 0 1 23.97 0)"
          stroke={fill}
          strokeOpacity="0.15"
          strokeWidth="0.03"
        />
        <path
          d="M20 12H4M12 4V20"
          stroke={fill}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const SaveIcon = () => {
  return (
    <svg
      width="1.25vw"
      height="1.25vw"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 20.5005H6C4.89543 20.5005 4 19.6051 4 18.5005V6.50049C4 5.39592 4.89543 4.50049 6 4.50049H9M8 20.5005V14.5005C8 13.9482 8.44772 13.5005 9 13.5005H15C15.5523 13.5005 16 13.9482 16 14.5005V20.5005M8 20.5005H16M9 4.50049V7.50049C9 8.05277 9.44772 8.50049 10 8.50049H14C14.5523 8.50049 15 8.05277 15 7.50049V4.50049M9 4.50049H15M16 20.5005H18C19.1046 20.5005 20 19.6051 20 18.5005V9.32892C20 8.79848 19.7893 8.28978 19.4142 7.9147L16.5858 5.08628C16.2107 4.7112 15.702 4.50049 15.1716 4.50049H15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Security = ({ fill = "black" }) => {
  return (
    <svg
      width="0.83vw"
      height="0.83vw"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        opacity={fill == "black" ? "0.35" : "1"}
        clipPath="url(#clip0_3291_44875)"
      >
        <path
          d="M10.4535 9.72427C12.7802 9.72427 14.6663 7.84581 14.6663 5.52863C14.6663 3.21145 12.7802 1.33301 10.4535 1.33301C8.12681 1.33301 6.24067 3.21145 6.24067 5.52863C6.24067 6.60193 6.73054 7.38254 6.73054 7.38254L1.63595 12.4563C1.40734 12.6839 1.08729 13.2759 1.63595 13.8223L2.22378 14.4077C2.45237 14.6029 3.02713 14.8761 3.49741 14.4077L4.18321 13.7247C4.86903 14.4077 5.65281 14.0175 5.94673 13.6271C6.43659 12.9441 5.84875 12.2611 5.84875 12.2611L6.0447 12.066C6.98521 13.0027 7.80821 12.4563 8.10214 12.066C8.59201 11.383 8.10214 10.7 8.10214 10.7C7.90621 10.3097 7.51434 10.3097 8.00414 9.82187L8.59201 9.23641C9.06227 9.62667 10.0289 9.72427 10.4535 9.72427Z"
          stroke={fill}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M11.9235 5.52902C11.9235 6.33734 11.2656 6.9926 10.454 6.9926C9.64231 6.9926 8.98438 6.33734 8.98438 5.52902C8.98438 4.7207 9.64231 4.06543 10.454 4.06543C11.2656 4.06543 11.9235 4.7207 11.9235 5.52902Z"
          stroke={fill}
          strokeWidth="1.2"
        />
      </g>
      <defs>
        <clipPath id="clip0_3291_44875">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const DownArrow = ({
  fill = "black",
  width = "0.62vw",
  height = "0.62vw",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L7 7L13 1"
        stroke={fill}
        strokeOpacity={fill == "black" ? "0.35" : "1"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SixDotsSvg = ({ fill = "black", fillOpacity = "0.35" }) => {
  return (
    <svg
      width="1.18vw"
      height="2.21vh"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.50195 7C9.60652 7 10.502 6.10457 10.502 5C10.502 3.89543 9.60652 3 8.50195 3C7.39738 3 6.50195 3.89543 6.50195 5C6.50195 6.10457 7.39738 7 8.50195 7Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M15.5 7C16.6046 7 17.5 6.10457 17.5 5C17.5 3.89543 16.6046 3 15.5 3C14.3954 3 13.5 3.89543 13.5 5C13.5 6.10457 14.3954 7 15.5 7Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M10.502 11.9998C10.502 13.1044 9.60652 13.9998 8.50195 13.9998C7.39738 13.9998 6.50195 13.1044 6.50195 11.9998C6.50195 10.8952 7.39738 9.99976 8.50195 9.99976C9.60652 9.99976 10.502 10.8952 10.502 11.9998Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M15.5 13.9998C16.6046 13.9998 17.5 13.1044 17.5 11.9998C17.5 10.8952 16.6046 9.99976 15.5 9.99976C14.3954 9.99976 13.5 10.8952 13.5 11.9998C13.5 13.1044 14.3954 13.9998 15.5 13.9998Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M10.502 19.0002C10.502 20.1048 9.60652 21.0002 8.50195 21.0002C7.39738 21.0002 6.50195 20.1048 6.50195 19.0002C6.50195 17.8956 7.39738 17.0002 8.50195 17.0002C9.60652 17.0002 10.502 17.8956 10.502 19.0002Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M15.5 21.0002C16.6046 21.0002 17.5 20.1048 17.5 19.0002C17.5 17.8956 16.6046 17.0002 15.5 17.0002C14.3954 17.0002 13.5 17.8956 13.5 19.0002C13.5 20.1048 14.3954 21.0002 15.5 21.0002Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
    </svg>
  );
};

export const UpArrow = ({ fill = "black" }) => {
  return (
    <svg
      width="0.62vw"
      height="0.62vw"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7L7 1L13 7"
        stroke={fill}
        strokeOpacity={fill == "black" ? "0.35" : "1"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SearchIcon = ({ fill = "black", width = "16", height = "16" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_733_17690)">
        <path
          d="M7.66634 14C11.1641 14 13.9997 11.1644 13.9997 7.66665C13.9997 4.16884 11.1641 1.33331 7.66634 1.33331C4.16854 1.33331 1.33301 4.16884 1.33301 7.66665C1.33301 11.1644 4.16854 14 7.66634 14Z"
          stroke={fill}
        />
        <path
          d="M12.333 12.3333L14.6663 14.6666"
          stroke={fill}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_733_17690">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Multiply = ({ fill = "#0F0F0F", width = "18", height = "18" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8301 12.7813C11.5698 13.0417 11.1477 13.0417 10.8873 12.7813L6.02441 7.91837L1.16151 12.7813C0.901163 13.0417 0.479049 13.0417 0.218702 12.7813C-0.0416508 12.521 -0.0416508 12.0988 0.218702 11.8385L5.08161 6.97557L0.218716 2.1127C-0.0416375 1.8523 -0.0416375 1.43024 0.218716 1.16984C0.479063 0.909503 0.901176 0.909503 1.16152 1.16984L6.02441 6.03277L10.8873 1.16984C11.1477 0.909503 11.5698 0.909503 11.8301 1.16984C12.0905 1.43024 12.0905 1.8523 11.8301 2.11264L6.96721 6.97557L11.8301 11.8385C12.0905 12.0988 12.0905 12.521 11.8301 12.7813Z"
        fill={fill}
      />
    </svg>
  );
};

export const CameraIcon = ({ fill = "black" }) => {
  return (
    <svg
      width="4.16vw"
      height="4.16vw"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 59.9992V29.9992C10 28.2311 10.7024 26.5354 11.9526 25.2851C13.2029 24.0349 14.8986 23.3325 16.6667 23.3325H19.7667C20.8639 23.3327 21.9443 23.062 22.9119 22.5445C23.8795 22.027 24.7043 21.2786 25.3133 20.3659L28.02 16.2992C28.629 15.3864 29.4539 14.6381 30.4214 14.1206C31.389 13.603 32.4694 13.3324 33.5667 13.3325H46.4333C47.5306 13.3324 48.611 13.603 49.5786 14.1206C50.5461 14.6381 51.371 15.3864 51.98 16.2992L54.6867 20.3659C55.2957 21.2786 56.1205 22.027 57.0881 22.5445C58.0557 23.062 59.136 23.3327 60.2333 23.3325H63.3333C65.1014 23.3325 66.7971 24.0349 68.0474 25.2851C69.2976 26.5354 70 28.2311 70 29.9992V59.9992C70 61.7673 69.2976 63.463 68.0474 64.7132C66.7971 65.9635 65.1014 66.6659 63.3333 66.6659H16.6667C14.8986 66.6659 13.2029 65.9635 11.9526 64.7132C10.7024 63.463 10 61.7673 10 59.9992Z"
        stroke={fill}
        strokeWidth="6.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 53.3325C45.5228 53.3325 50 48.8554 50 43.3325C50 37.8097 45.5228 33.3325 40 33.3325C34.4772 33.3325 30 37.8097 30 43.3325C30 48.8554 34.4772 53.3325 40 53.3325Z"
        stroke={fill}
        strokeWidth="6.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const EditIcon = ({ width = "17", height = "18" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1095_6279)">
        <path
          d="M14.167 2.49993C14.3859 2.28106 14.6457 2.10744 14.9317 1.98899C15.2176 1.87054 15.5241 1.80957 15.8337 1.80957C16.1432 1.80957 16.4497 1.87054 16.7357 1.98899C17.0216 2.10744 17.2815 2.28106 17.5003 2.49993C17.7192 2.7188 17.8928 2.97863 18.0113 3.2646C18.1297 3.55057 18.1907 3.85706 18.1907 4.16659C18.1907 4.47612 18.1297 4.78262 18.0113 5.06859C17.8928 5.35455 17.7192 5.61439 17.5003 5.83326L6.25033 17.0833L1.66699 18.3333L2.91699 13.7499L14.167 2.49993Z"
          stroke="#667085"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1095_6279">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};  
