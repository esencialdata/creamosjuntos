export const generateGoogleCalendarLink = (event, roleData) => {
    // Helper to parse date string "Sábado 06 Dic" to YYYYMMDD
    const parseDate = (dateStr) => {
        const months = {
            'Ene': '01', 'Feb': '02', 'Mar': '03', 'Abr': '04', 'May': '05', 'Jun': '06',
            'Jul': '07', 'Ago': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dic': '12'
        };

        // Expected format: "Day DD Mon" e.g., "Sábado 06 Dic"
        const parts = dateStr.split(' ');
        if (parts.length === 3) {
            const day = parts[1]; // "06"
            const month = months[parts[2]]; // "12"
            const year = '2025';
            return `${year}${month}${day}`;
        }

        // Fallback for YYYY-MM-DD
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateStr.replace(/-/g, '');
        }

        return null;
    };

    // Helper to format time "10:00 AM" to HHmm00
    const parseTime = (timeStr) => {
        // Simple parser for "HH:MM AM/PM"
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (period === 'PM' && hours !== '12') {
            hours = parseInt(hours) + 12;
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours.toString().padStart(2, '0')}${minutes}00`;
    };

    const dateBase = parseDate(event.date);
    if (!dateBase) return null;

    // Assume 2 hour duration default
    const startTime = parseTime(event.time); // e.g. 100000

    // Calculate end time (start + 2 hours)
    // Simple logic: add 2 to hours. Handle overflow if needed but 10am -> 12pm is safe/simple for now.
    let startHour = parseInt(startTime.substring(0, 2));
    let endHour = startHour + 2;
    const endTime = `${endHour.toString().padStart(2, '0')}${startTime.substring(2)}`;

    const startDateTime = `${dateBase}T${startTime}Z`; // Note: Z implies UTC. 
    // Ideally we'd use local time so Google Calendar infers timezone, or specify. 
    // "YYYYMMDDTHHmmss" without Z uses user's calendar timezone, which is safer for this context.

    const fmtStart = `${dateBase}T${startTime}`;
    const fmtEnd = `${dateBase}T${endTime}`;

    const title = encodeURIComponent(`Campo David: ${event.type} - ${roleData.role}`);

    let description = `Te toca participar como ${roleData.role}.`;
    if (event.objective) {
        description += ` Objetivo: ${event.objective}`;
    }
    description = encodeURIComponent(description);

    const location = encodeURIComponent("Campo David");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmtStart}/${fmtEnd}&details=${description}&location=${location}`;
};
