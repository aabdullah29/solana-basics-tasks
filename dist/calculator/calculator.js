"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCounter = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
const borsh = __importStar(require("borsh"));
const bn_js_1 = __importDefault(require("bn.js"));
const CONTRACT_PROGRAM_ID = "Es658hdoKUraHJPiCbpFF2P4nJU6FTy7xsf93yPxaMxq";
class GreetingAccount {
    constructor(fields = undefined) {
        this.counter = 0;
        if (fields) {
            this.counter = fields.counter;
        }
    }
}
const GreetingSchema = new Map([
    [GreetingAccount, { kind: 'struct', fields: [['counter', 'u32']] }],
]);
const createDataAccount = (connection, parentAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const dataAccount = web3_js_1.Keypair.generate();
    const createAccountInstruction = yield web3_js_1.SystemProgram.createAccount({
        fromPubkey: parentAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: 1000000000,
        space: 4,
        programId: new web3_js_1.PublicKey(CONTRACT_PROGRAM_ID)
    });
    const transaction = new web3_js_1.Transaction();
    transaction.add(createAccountInstruction);
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [parentAccount, dataAccount]);
    return dataAccount;
});
const numberToBuffer = (num) => {
    const bn = new bn_js_1.default(num);
    const bnArr = bn.toArray().reverse();
    const bnBuffer = Buffer.from(bnArr);
    const zeroPad = Buffer.alloc(4);
    bnBuffer.copy(zeroPad);
    return zeroPad;
};
const callCounter = (parentAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    yield (0, airdrop_1.airdrop)(parentAccount.publicKey, 2);
    // const dataAccount = await createDataAccount(connection, parentAccount);
    const dataAccount = new web3_js_1.PublicKey("377fLfoJM5j1phazeKF8s9cQNDYhzA29x1cxCbSRCPvY");
    const buffers = [Buffer.from(Int8Array.from([1])), numberToBuffer(7)];
    const data = Buffer.concat(buffers);
    const instruction = new web3_js_1.TransactionInstruction({
        keys: [{ pubkey: dataAccount, isSigner: false, isWritable: true }],
        programId: new web3_js_1.PublicKey(CONTRACT_PROGRAM_ID),
        data: data
    });
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [parentAccount]);
    // Read data
    const accountInfo = yield connection.getAccountInfo(dataAccount);
    const greeting = borsh.deserialize(GreetingSchema, GreetingAccount, accountInfo.data);
    console.log(
    // dataAccount,
    dataAccount.toBase58(), 'has been greeted', greeting.counter, 'time(s)');
});
exports.callCounter = callCounter;
(0, exports.callCounter)(web3_js_1.Keypair.generate());
//# sourceMappingURL=calculator.js.map