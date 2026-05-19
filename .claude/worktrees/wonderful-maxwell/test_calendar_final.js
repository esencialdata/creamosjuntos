import { generateGoogleCalendarLink } from './src/utils/calendarUtils.js';

console.log("Testing Calendar Link Generation (Final Fix)...");

const badEvent = {
    date: "Viernes 05",
    time: "7:00 PM",
    type: "Test Event"
};

const roleData = {
    role: "Tester",
    name: "Aaron"
};

const link = generateGoogleCalendarLink(badEvent, roleData);
console.log(`\nInput Date: "${badEvent.date}"`);
console.log(`Expected: 20251205...`);
console.log(`Link: ${link}`);

if (link && link.includes('dates=20251205')) {
    console.log("SUCCESS: Fallback to December working.");
} else {
    console.error("ERROR: Failed to handle missing month.");
}
