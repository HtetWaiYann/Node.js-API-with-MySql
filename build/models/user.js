"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    name: {
        type: String,
        //optional
        //   required: [true, 'Please enter a full name'],
        //   index: true,
    },
    email: {
        type: String,
        //optional
        //   lowercase: true,
        //   unique: true,
        //   index: true,
    },
    password: String,
    role: {
        type: String,
        default: 'user',
    },
}, { timestamps: true });
// 'User' is table name, User is database schema
exports.default = mongoose_1.default.model('User', User);
