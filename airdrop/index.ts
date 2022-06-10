import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

const public_kay = "6nZRR27JKqK1isskNgtib6n6Und7xuJYPhjWfiSUypEd";
export const airdrop = async (address: PublicKey , amount: number) => {
    const pubKey = new PublicKey(address);
    const conn = new Connection("http://localhost:8899", "confirmed");
    const signature = await conn.requestAirdrop(pubKey, amount * LAMPORTS_PER_SOL);
    await conn.confirmTransaction(signature);
}

export const showBalance = async (pubKey: PublicKey) => {
    const conn = new Connection("http://localhost:8899", "confirmed");
    const response = await conn.getAccountInfo(pubKey);
    return response.lamports/LAMPORTS_PER_SOL;
}


export const transferSol = async (from: Keypair, to: PublicKey, amount: number) => {
    const conn = new Connection("http://localhost:8899", "confirmed");
    const insteuction = SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL * amount
    });

    const transaction = new Transaction();
    transaction.add(insteuction);
    await sendAndConfirmTransaction(
        conn,
        transaction,
        [from] // signers
    );
    console.log('Done.');
}


const secret = Uint8Array.from([140,215,28,115,86,43,207,165,184,107,212,77,9,187,137,255,143,204,94,194,7,35,142,144,127,21,193,24,27,47,112,74,193,191,215,111,242,24,232,193,65,165,8,187,172,9,92,225,15,187,67,160,86,164,245,216,108,78,141,146,61,196,142,237]);
const fromKayPair = Keypair.fromSecretKey(secret);
const toPublicKey = new PublicKey(public_kay);

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