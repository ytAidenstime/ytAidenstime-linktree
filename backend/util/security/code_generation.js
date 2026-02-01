import { v4 as uuidv4 } from "uuid";

function generateCode() {
    return uuidv4();
}

export { generateCode }