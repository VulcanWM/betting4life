import dbConnect from './mongodb';
import User from '../models/User';
import Bet from '@/models/Bet';
import { Types } from 'mongoose';

export async function get_user(username: string) {
    await dbConnect();
    const user = await User.find({username: username})
    if (user.length == 0){
        return false
    } else {
        return user[0]
    }
}

export async function get_user_from_email(email: string) {
    await dbConnect();
    const user = await User.find({email: email})
    if (user.length == 0){
        return false
    } else {
        return user[0]
    }
}

export async function create_user(username: string, email: string) {
    await dbConnect();
    username = username.toLowerCase();
    username = username.replaceAll(" ", "_")
    if (await get_user(username) != false){
        return "This username already exists!"
    }
    if (await get_user_from_email(email) != false){
        return "This email is already being used for an account!"
    }
    if (username.length > 20){
        return "Your username cannot have more than 20 characters!"
    }
    if (username.length < 3){
        return "Your username must be at least 3 characters long!"
    }
    const created = new Date()
    const user = await User.create({
        username: username, 
        email: email, 
        created: created, 
        banned: false,
        wins: 0,
        losses: 0,
        draws: 0,
        currency: 100,
        badges: ['Early User'] 
    })
    return true
}

export async function give_currency(username: string, amount: number){
    const user = await get_user(username)
    if (user == false){
        return `${user.username} does not exist!`
    } else {
        const newCurrency = user.currency + amount;
        if (newCurrency < 0){
            return `If this happens, then ${user.username} will be broke`
        }
        await User.findOneAndUpdate({username: username}, {currency: newCurrency});
        return true
    }
}

export async function create_bet(starter: string, acceptor: string, guarantor: string, amount: number, title: string, desc: string){
    const starterDoc = await get_user(starter)
    if (starterDoc == false){
        return `${starter} does not exist!`
    }
    const acceptorDoc = await get_user(acceptor)
    if (acceptorDoc == false){
        return `${acceptor} does not exist!`
    }
    const guarantorDoc = await get_user(guarantor)
    if (guarantorDoc == false){
        return `${guarantor} does not exist!`
    }
    if ((starterDoc.currency - amount) < 0){
        return `${starter} does not have enough currency!`
    }
    if ((acceptorDoc.currency - amount) < 0){
        return `${acceptor} does not have enough currency!`
    }
    await Bet.create({
        title: title,
        desc: desc,
        amount: amount,
        starter: starter,
        acceptor: acceptor,
        guarantor: guarantor,
        status: false
    })
}

export async function get_bet(id: string) {
    await dbConnect();
    const objectId = new Types.ObjectId(id)
    const bet = await Bet.find({_id: objectId})
    if (bet.length == 0){
        return false
    } else {
        return bet[0]
    }
}

export async function accept_bet(acceptor: string, id: string){
    const bet = await get_bet(id)
    if (bet == false){
        return "This bet id does not exist!"
    }
    if (bet.status == true){
        return "This bet has already started!"
    }
    if (bet.acceptor != acceptor){
        return "You are not the acceptor of this bet!"
    }
    const starterDoc = await get_user(bet.starter)
    if ((starterDoc.currency - bet.amount) < 0){
        return `${starterDoc.username} does not have enough currency!`
    }
    const acceptorDoc = await get_user(acceptor)
    if ((acceptorDoc.currency - bet.amount) < 0){
        return `${acceptor} does not have enough currency!`
    }
    const removeCurrencyStarter = await give_currency(starterDoc.username, bet.amount*-1)
    if (removeCurrencyStarter != true){
        return removeCurrencyStarter
    }
    const removeCurrencyAcceptor = await give_currency(acceptor, bet.amount*-1)
    if (removeCurrencyAcceptor != true){
        return removeCurrencyAcceptor
    }
    await Bet.findOneAndUpdate({_id: bet._id}, {status: true});
    return true
}

export async function deny_bet(acceptor: string, id: string){
    const bet = await get_bet(id)
    if (bet == false){
        return "This bet id does not exist!"
    }
    if (bet.status == true){
        return "This bet has already started!"
    }
    if (bet.acceptor != acceptor){
        return "You are not the acceptor of this bet!"
    }
    await Bet.findOneAndDelete({id: bet._id})
    return true
}