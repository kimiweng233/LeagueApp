export function calculateTimeRemaining(datetime) {
    const now = new Date();
    const targetDate = new Date(datetime);

    // Calculate the difference in milliseconds between now and the target datetime
    let difference = targetDate - now;

    // If the target datetime has already passed, set the difference to 0
    if (difference < 0) {
        difference = 0;
    }

    // Calculate the remaining days, hours, and minutes
    const remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const remainingMinutes = Math.floor((difference / (1000 * 60)) % 60);

    // Format the remaining time as DD days, HH hours, and MM minutes
    const formattedTime = `${String(remainingDays).padStart(
        2,
        "0"
    )} days ${String(remainingHours).padStart(2, "0")} hours ${String(
        remainingMinutes
    ).padStart(2, "0")} minutes`;

    return formattedTime;
}
