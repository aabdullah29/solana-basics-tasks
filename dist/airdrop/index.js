"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSol = exports.showBalance = exports.airdrop = void 0;
const web3_js_1 = require("@solana/web3.js");
const public_kay = "6nZRR27JKqK1isskNgtib6n6Und7xuJYPhjWfiSUypEd";
const airdrop = (address, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const pubKey = new web3_js_1.PublicKey(address);
    const conn = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const signature = yield conn.requestAirdrop(pubKey, amount * web3_js_1.LAMPORTS_PER_SOL);
    yield conn.confirmTransaction(signature);
});
exports.airdrop = airdrop;
const showBalance = (pubKey) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const response = yield conn.getAccountInfo(pubKey);
    return response.lamports / web3_js_1.LAMPORTS_PER_SOL;
});
exports.showBalance = showBalance;
const transferSol = (from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const insteuction = web3_js_1.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: web3_js_1.LAMPORTS_PER_SOL * amount
    });
    const transaction = new web3_js_1.Transaction();
    transaction.add(insteuction);
    yield (0, web3_js_1.sendAndConfirmTransaction)(conn, transaction, [from] // signers
    );
    console.log('Done.');
});
exports.transferSol = transferSol;
const secret = Uint8Array.from([140, 215, 28, 115, 86, 43, 207, 165, 184, 107, 212, 77, 9, 187, 137, 255, 143, 204, 94, 194, 7, 35, 142, 144, 127, 21, 193, 24, 27, 47, 112, 74, 193, 191, 215, 111, 242, 24, 232, 193, 65, 165, 8, 187, 172, 9, 92, 225, 15, 187, 67, 160, 86, 164, 245, 216, 108, 78, 141, 146, 61, 196, 142, 237]);
const fromKayPair = web3_js_1.Keypair.fromSecretKey(secret);
const toPublicKey = new web3_js_1.PublicKey(public_kay);
// (async() => {
//     await airdrop(fromKayPair.publicKey, 5);
//     // await airdrop(new PublicKey(public_kay), 1);
//     let balanceFrom = await showBalance(fromKayPair.publicKey);
//     let balanceTo = await showBalance(new PublicKey(public_kay));
//     console.log(`Initial Balance: (From: ${balanceFrom} , To: ${balanceTo})`);
//     await transferSol(fromKayPair, toPublicKey, 2);
//     balanceFrom = await showBalance(fromKayPair.publicKey);
//     balanceTo = await showBalance(new PublicKey(public_kay));
//     console.log(`Balance After: (From: ${balanceFrom} , To: ${balanceTo})`);
// })()
//# sourceMappingURL=index.js.map