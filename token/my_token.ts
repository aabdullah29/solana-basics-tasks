import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction, TransactionInstruction
} from "@solana/web3.js";
import {airdrop, showBalance} from "../airdrop";
import * as borsh from 'borsh';

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


enum AccountTag{
    Uninitialized,
    Mint,
    TokenAccount,
}

class Mint{
    tag: AccountTag;
    authority: PublicKey;
    supply: number;

    constructor(fields: {tag: AccountTag, authority: PublicKey, supply: number} | undefined = undefined) {
        if (fields) {
            this.tag = fields.tag;
            this.authority = fields.authority;
            this.supply = fields.supply;
        }
    }
}

const MintSchema = new Map([
    [Mint, {kind: 'struct', fields: [['tag', 'AccountTag'], ['authority', 'Pubkey'], ['supply', 'u64']]}],
]);


class TokenAccount{
    tag: AccountTag;
    owner: PublicKey;
    mint: PublicKey;
    amount: number;

    constructor(fields: {tag: AccountTag, owner: PublicKey, mint: PublicKey, amount: number} | undefined = undefined) {
        if (fields) {
            this.tag = fields.tag;
            this.owner = fields.owner;
            this.mint = fields.mint;
            this.amount = fields.amount;
        }
    }
}

const TokenSchema = new Map([
    [TokenAccount, {kind: 'struct', fields: [['tag', 'AccountTag'], ['owner', 'Pubkey'], 
    ['mint', 'Pubkey'], ['amount', 'u64']]}],
]);




const createDataAccount = async (connection, parentAccount): Promise<Keypair> => {
    const dataAccount = Keypair.generate();
    const createAccountInstruction = await SystemProgram.createAccount({
        fromPubkey: parentAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: 1000000000,
        space: 4,
        programId: new PublicKey(CONTRACT_PROGRAM_ID)
    });
    const transaction = new Transaction();
    transaction.add(createAccountInstruction);
    await sendAndConfirmTransaction(connection, transaction, [parentAccount, dataAccount]);
    return dataAccount;
}

export const callCounter = async(parentAccount: Keypair) => {
    const connection = new Connection("http://localhost:8899", "confirmed");
    
    await airdrop(parentAccount.publicKey, 15);

    const mint_account = await createDataAccount(connection, parentAccount);
    const mint_authority = await createDataAccount(connection, parentAccount);
    // const dataAccount = new PublicKey("G2TBXXFtSAe3m3gAQaW9zrpgM6ViEQJZMH9EjgoWd6La");


    await airdrop(parentAccount.publicKey, 15);
    await airdrop(mint_account.publicKey, 15);
    await airdrop(mint_authority.publicKey, 15);

    let a1 = await showBalance(parentAccount.publicKey);
    let a2 = await showBalance(mint_account.publicKey);
    let a3 = await showBalance(mint_authority.publicKey);
    
    
    console.log("Minting Account ------->", parentAccount.publicKey.toBase58(),' ', a1 );
    console.log("Minting Account ------->", mint_account.publicKey.toBase58(),' ', a2);
    console.log("Mint Authority -------->", mint_authority.publicKey.toBase58(),' ', a3);

    const instruction = new TransactionInstruction({
        keys: [{pubkey: mint_account.publicKey, isSigner: false, isWritable: true}, 
            {pubkey: mint_authority.publicKey, isSigner: true, isWritable: true}],
        programId: new PublicKey(CONTRACT_PROGRAM_ID),
        data: Buffer.alloc(0), // All instructions 
    });


    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [parentAccount],
    );


    // Read data
    // const accountInfo = await connection.getAccountInfo(dataAccount.publicKey);

    // const greeting = borsh.deserialize(
    //     GreetingSchema,
    //     GreetingAccount,
    //     accountInfo.data,
    // );

    console.log(
        mint_account.publicKey, ' and ', mint_authority.publicKey, 
        // mint_account.toBase58(),
        'has been greeted',
        // greeting.counter,
        'time(s)',
    );

}

callCounter(Keypair.generate());