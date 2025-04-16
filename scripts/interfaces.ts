// Define types for the API response structure
interface TonTransferAction {
    type: string;
    status: string;
    TonTransfer: {
        comment: string;
        sender: {
            address: string;
        };
    };
}

interface Event {
    in_progress: boolean;
    actions: TonTransferAction[];
}

interface ApiResponse {
    events: Event[];
}