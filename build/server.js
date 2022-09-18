"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/users", (request, response) => {
    return response.status(200).json({ message: "hello wolrd" });
});
const PORT = 3333;
app.listen(PORT, () => console.log(`server running... PORT (${PORT})`));
