/**
 * Recieves a time string, returns xx ago (days, hours, minutes).
 * @param {string} time - 2024-05-08T09:18:08.622Z time example
 * @returns {string} displayed time - 20 days ago
 */

export const getTimeAgo = (time: string) => {
    const dateValue = new Date(time);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - dateValue.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    let displayedTime;
    if (diffInMinutes < 60) {
        displayedTime = `${diffInMinutes} min${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
        displayedTime = `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
        displayedTime = `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    return displayedTime;
};
