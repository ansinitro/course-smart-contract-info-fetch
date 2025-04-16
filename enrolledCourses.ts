import './scripts/interfaces'
import { getEventsUrl } from './utils/generateLinks';

const ENROLLED_MESSAGE = "You have successfully enrolled to the course!";
const STUDENT_ADDRESS = "0QC4hAk6Xhs4UY3dPZ3o0UbR5dnV4EeO-6I0dp13fYcsjAxo";

async function getEnrolledCourses(studentAddress: string): Promise<string[]> {
    let enrolledCourses: string[] = [];
    let response = await fetch(getEventsUrl(studentAddress, 100));
    
    const { events }: ApiResponse = await response.json(); 
    events.forEach(e => {
        if (e.in_progress) {
            return;
        }
        e.actions.forEach(a => {
            if (!(a.type === "TonTransfer" && a.status === "ok")) {
                return;
            }
            if (a.TonTransfer.comment === ENROLLED_MESSAGE) {
                enrolledCourses.push(a.TonTransfer.sender.address);
            }
        });
    });

    return enrolledCourses;
}

async function main() {
    try {
        const enrolledCourses = await getEnrolledCourses(STUDENT_ADDRESS);
        console.log(enrolledCourses);
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
    }
}

main();


