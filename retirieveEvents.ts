import { Cell } from '@ton/core';
import {getEventsUrl, getTransaction} from "./utils/generateLinks"

const opNames = {
    'Enrollment': '0xe5443d9f',
};

async function fetchLatestEnrollmentEvent(contractAddress: string) {
    const response = await fetch(getEventsUrl(contractAddress, 100));
    const { events } = await response.json();

    const event = events.find((e: any) =>
        !e.in_progress &&
        e.actions?.[0]?.SmartContractExec?.operation === opNames.Enrollment
    );

    if (!event) return;
    const txHash = event.actions[0].base_transactions[0];
    const txResponse = await fetch(getTransaction(txHash));
    const { out_msgs } = await txResponse.json();

    const msg = out_msgs.find((m: any) => m.msg_type === 'ext_out_msg');
    if (!msg?.raw_body) return;

    return parseEnrollmentEmit(msg.raw_body);
}

function parseEnrollmentEmit(rawHex: string) {
    const cell = Cell.fromBoc(Buffer.from(rawHex, 'hex'))[0];
    const slice = cell.beginParse();

    const opcode = slice.loadUint(32); // should be 0xe5443d9f
    const opcodeHex = `0x${opcode.toString(16)}`;
    if (opcodeHex !== opNames.Enrollment) {
        throw new Error(`Unexpected opcode: ${opcode.toString(16)}`);
    }

    const studentIdCell = slice.loadRef();
    const studentGmailCell = slice.loadRef();

    const studentId = studentIdCell.beginParse().loadStringTail();
    const studentGmail = studentGmailCell.beginParse().loadStringTail();

    return { opcode, studentId, studentGmail };
}

async function main() {
    const contractAddress = "EQAOVJK45F5bccbgGwGy7adNI37ohg0vO0WFJIsCmA_7hBxF";
    const data = await fetchLatestEnrollmentEvent(contractAddress);

    if (data) {
        console.log("✅ Enrollment Event Found:");
        console.log("Opcode:", data.opcode.toString(16));
        console.log("Student ID:", data.studentId);
        console.log("Student Gmail:", data.studentGmail);
    } else {
        console.log("No enrollment event found.");
    }
}

main().catch(console.error);
