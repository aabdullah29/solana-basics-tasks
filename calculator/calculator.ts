import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction, TransactionInstruction
} from "@solana/web3.js";
import {airdrop} from "../airdrop";
import * as borsh from 'borsh';
import BN from 'bn.js';

const CONTRACT_PROGRAM_ID = "Es658hdoKUraHJPiCbpFF2P4nJU6FTy7xsf93yPxaMxq";

class GreetingAccount {
    counter = 0;
    constructor(fields: {counter: number} | undefined = undefined) {
        if (fields) {
            this.counter = fields.counter;
        }
    }
}

const GreetingSchema = new Map([
    [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
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

const numberToBuffer = (num: number) => {
    const bn = new BN(num);
    const bnArr = bn.toArray().reverse();
    const bnBuffer = Buffer.from(bnArr);
    const zeroPad = Buffer.alloc(4);
    bnBuffer.copy(zeroPad)
    return zeroPad;
}

export const callCounter = async(parentAccount: Keypair) => {
    const connection = new Connection("http://localhost:8899", "confirmed");
    await airdrop(parentAccount.publicKey, 2);
    // const dataAccount = await createDataAccount(connection, parentAccount);
    const dataAccount = new PublicKey("377fLfoJM5j1phazeKF8s9cQNDYhzA29x1cxCbSRCPvY");

    const buffers = [Buffer.from(Int8Array.from([1])), numberToBuffer(7)];
    const data = Buffer.concat(buffers);

    const instruction = new TransactionInstruction({
        keys: [{pubkey: dataAccount, isSigner: false, isWritable: true}],
        programId: new PublicKey(CONTRACT_PROGRAM_ID),
        data: data
    });

    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [parentAccount],
    );

    // Read data
    const accountInfo = await connection.getAccountInfo(dataAccount);
    const greeting = borsh.deserialize(
        GreetingSchema,
        GreetingAccount,
        accountInfo.data,
    );

    console.log(
        // dataAccount,
        dataAccount.toBase58(),
        'has been greeted',
        greeting.counter,
        'time(s)',
    );

}

callCounter(Keypair.generate());