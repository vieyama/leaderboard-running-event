export function calculateTotalPace(distanceKm: number, durationHHMMSS: string) {
    // Split time into hours, minutes, seconds
    const [hours, minutes, seconds] = durationHHMMSS.split(":").map(Number);

    // Convert total time to seconds
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    // Calculate pace in seconds per km
    const paceSeconds = totalSeconds / distanceKm;

    // Convert pace to minutes:seconds format
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceRemainingSeconds = Math.round(paceSeconds % 60);

    return `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, '0')} min/km`;
}

export function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}