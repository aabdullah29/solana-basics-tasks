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
exports.callCounter = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
const CONTRACT_PROGRAM_ID = "66H9aTPEM6BGdUdYAFJdCyJ2bsjWKs2ywCU6NdZUJKEf";
// class GreetingAccount {
//     counter = 0;
//     constructor(fields: {counter: number} | undefined = undefined) {
//         if (fields) {
//             this.counter = fields.counter;
//         }
//     }
// }
// const GreetingSchema = new Map([
//     [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
// ]);
var AccountTag;
(function (AccountTag) {
    AccountTag[AccountTag["Uninitialized"] = 0] = "Uninitialized";
    AccountTag[AccountTag["Mint"] = 1] = "Mint";
    AccountTag[AccountTag["TokenAccount"] = 2] = "TokenAccount";
})(AccountTag || (AccountTag = {}));
class Mint {
    constructor(fields = undefined) {
        if (fields) {
            this.tag = fields.tag;
            this.authority = fields.authority;
            this.supply = fields.supply;
        }
    }
}
const MintSchema = new Map([
    [Mint, { kind: 'struct', fields: [['tag', 'AccountTag'], ['authority', 'Pubkey'], ['supply', 'u64']] }],
]);
class TokenAccount {
    constructor(fields = undefined) {
        if (fields) {
            this.tag = fields.tag;
            this.owner = fields.owner;
            this.mint = fields.mint;
            this.amount = fields.amount;
        }
    }
}
const TokenSchema = new Map([
    [TokenAccount, { kind: 'struct', fields: [['tag', 'AccountTag'], ['owner', 'Pubkey'],
                ['mint', 'Pubkey'], ['amount', 'u64']] }],
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
const callCounter = (parentAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    yield (0, airdrop_1.airdrop)(parentAccount.publicKey, 15);
    const mint_account = yield createDataAccount(connection, parentAccount);
    const mint_authority = yield createDataAccount(connection, parentAccount);
    // const dataAccount = new PublicKey("G2TBXXFtSAe3m3gAQaW9zrpgM6ViEQJZMH9EjgoWd6La");
    yield (0, airdrop_1.airdrop)(parentAccount.publicKey, 15);
    yield (0, airdrop_1.airdrop)(mint_account.publicKey, 15);
    yield (0, airdrop_1.airdrop)(mint_authority.publicKey, 15);
    let a1 = yield (0, airdrop_1.showBalance)(parentAccount.publicKey);
    let a2 = yield (0, airdrop_1.showBalance)(mint_account.publicKey);
    let a3 = yield (0, airdrop_1.showBalance)(mint_authority.publicKey);
    console.log("Minting Account ------->", parentAccount.publicKey.toBase58(), ' ', a1);
    console.log("Minting Account ------->", mint_account.publicKey.toBase58(), ' ', a2);
    console.log("Mint Authority -------->", mint_authority.publicKey.toBase58(), ' ', a3);
    const instruction = new web3_js_1.TransactionInstruction({
        keys: [{ pubkey: mint_account.publicKey, isSigner: false, isWritable: true },
            { pubkey: mint_authority.publicKey, isSigner: true, isWritable: true }],
        programId: new web3_js_1.PublicKey(CONTRACT_PROGRAM_ID),
        data: Buffer.alloc(0), // All instructions 
    });
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [parentAccount]);
    // Read data
    // const accountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    // const greeting = borsh.deserialize(
    //     GreetingSchema,
    //     GreetingAccount,
    //     accountInfo.data,
    // );
    console.log(mint_account.publicKey, ' and ', mint_authority.publicKey, 
    // mint_account.toBase58(),
    'has been greeted', 
    // greeting.counter,
    'time(s)');
});
exports.callCounter = callCounter;
(0, exports.callCounter)(web3_js_1.Keypair.generate());
//# sourceMappingURL=my_token.js.map