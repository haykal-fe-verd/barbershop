"use client";

import React from "react";

function ProtectedLayoutDate() {
    // states
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // mounted
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    const currentDateFormatted = currentDate.toLocaleDateString("id-ID", options);

    return (
        <div className="hidden items-center space-x-2 md:flex">
            <div className="rounded-md border border-primary px-2 py-1 text-sm">{currentDateFormatted}</div>
        </div>
    );
}

export default ProtectedLayoutDate;
