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
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
// 2 
// get the wallet 
// return newly create mint address
const createMint = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", 'confirmed');
    const creatorToken = yield spl_token_1.Token.createMint(connection, mintWallet, mintWallet.publicKey, null, 8, spl_token_1.TOKEN_PROGRAM_ID);
    return creatorToken.publicKey;
});
// 3
// creatorToken is object of "Token"
const transferTokens = (tokenAddress, mintWallet, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection("http://localhost:8899", 'confirmed');
    const creatorToken = new spl_token_1.Token(connection, tokenAddress, spl_token_1.TOKEN_PROGRAM_ID, mintWallet);
    // crearte data account for the token
    const mintTokenAccount = yield creatorToken.getOrCreateAssociatedAccountInfo(mintWallet.publicKey);
    yield creatorToken.mintTo(mintTokenAccount.address, mintWallet.publicKey, [], 100000000);
    const receiverTokenAccount = yield creatorToken.getOrCreateAssociatedAccountInfo(receiver);
    console.log(`ReceiverTokenAccount address: ${receiverTokenAccount.address}`);
    const transaction = new web3_js_1.Transaction().add(spl_token_1.Token.createTransferInstruction(spl_token_1.TOKEN_PROGRAM_ID, mintTokenAccount.address, receiverTokenAccount.address, mintWallet.publicKey, [], 100000000));
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [mintWallet], { commitment: "confirmed" });
});
// 1 
// create new wallet and airdrom
// mintWallet has ability to create new token
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mintWallet = yield web3_js_1.Keypair.generate();
    yield (0, airdrop_1.airdrop)(mintWallet.publicKey, 2);
    const creatorTokenAddress = yield createMint(mintWallet);
    yield transferTokens(creatorTokenAddress, mintWallet, new web3_js_1.PublicKey("7WhniuDu9K2g7bog7JN2HuU1QkRcDv2ppDbrmRCf51sk"));
    console.log(`Creator token address: ${creatorTokenAddress}`);
    console.log(`mintWallet address: ${mintWallet.publicKey}`);
}))();
//# sourceMappingURL=index.js.map