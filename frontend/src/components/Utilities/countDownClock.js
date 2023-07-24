import React, { useEffect, useState } from "react";

function CountdownClock({ targetDateTime }) {
    const [countdown, setCountdown] = useState("");
    const [daysCounts, setDaysCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Calculate the remaining time
            const now = new Date().getTime();
            const targetTime = new Date(targetDateTime).getTime();
            const remainingTime = targetTime - now;

            // Check if the target datetime has passed
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                setCountdown("00days 00hours 00minutes 00seconds");
                return;
            }

            // Convert remaining time to days, hours, minutes, and seconds
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // Format the countdown string
            const formattedCountdown = `${String(days).padStart(
                2,
                "0"
            )}days ${String(hours).padStart(2, "0")}hours ${String(
                minutes
            ).padStart(2, "0")}minutes ${String(seconds).padStart(
                2,
                "0"
            )}seconds`;

            // Update the countdown state
            setCountdown(formattedCountdown);
            setDaysCount(days);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [targetDateTime]);

    return (
        <h3
            className={`dateTimeCountdownText ${
                daysCounts < 1
                    ? "redTextHalo"
                    : daysCounts > 3
                    ? "blueTextHalo"
                    : "orangeTextHalo"
            }`}
        >
            {countdown}
        </h3>
    );
}

export default CountdownClock;
