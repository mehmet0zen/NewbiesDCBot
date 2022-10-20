import Kevy from 'keyv';

const kevy = new Kevy();
let lastValidMessage = null;

export class Count {
    constructor(countingChannelID, starter_number = 0) {
        this.startingNum = starter_number;
        this.channel_id = countingChannelID;
        kevy.on('error', err => console.error('Keyv connection error:', err));
    }

    count(message) {
        if (message.channelId !== this.channel_id) return;

        let countingKey;
        let boostUsed;
        (async () => {
            countingKey = await kevy.get(`counting_${message.guild.id}`);
            boostUsed = await kevy.get('boost') || true;
            if (countingKey == undefined) {
                if (Number(message.content.split(' ')[0]) !== 1)
                    return;
                countingKey = `0_0_0`;
                await kevy.set(`counting_${message.guild.id}`, `0_0_0`);
            }
            if (boostUsed == undefined)
                await kevy.set('boost', true);
            let currentNumber = countingKey.split(`_`)[0];
            if (currentNumber === `0` && Number(message.content.split(' ')[0]) !== 1) 
                return;
            let highScore = countingKey.split(`_`)[1];
            let lastUser = countingKey.split('_')[2];
            try {
                if (Number(currentNumber) > 0) {
                    if (message.member.id === lastUser && message.author.id !== `508249387927994378`) {
                        await message.channel.send(`Wait for your turn! \ncurrent: ${currentNumber}`)
                        await message.react(`❔`);
                        return console.log('returned because same user!');
                    }
                }
            } catch (e) {
                console.log(e);
            }
            let first_word = message.content.split(' ')[0].toLowerCase() 
            let result = Number(first_word);
                                
            //if number is one more than the counting number
            if (message.content.toUpperCase().includes('ADMIN')) {
                if (message.author.id === '508249387927994378') {
                    if (message.content.toUpperCase().includes('CONTINUE') || message.content.toUpperCase().includes('+')) {
                        await message.react(`🙄`);
                        result = Number(currentNumber) + Number(message.content.split(' ')[message.content.split(' ').length - 1]);
                        await kevy.set(`counting_${message.guild.id}`, result + `_` + highScore + `_${message.author.id}`);
                        await message.react(`✅`);
                        if (Number(result) === (Number(highScore) + 1))
                            await message.react(`👑`);
                        return await message.channel.send(`Alright alright here...`);
                    } else {
                        await message.react(`😐`);
                        return await message.channel.send(`Fire wall Activated...`);
                    }
                } else {
                    const randmessage = [`You are too funny!`, `bruhh just count it lol`, `hmm, let me think about it\nNO!`, `Do you know how to type number?`, `bruhh`]
                    const randemoji = [`😒`, `🙂`, `😞`, `😕`, `😩`, `🙄`, `😐`, `🫠`, `🫤`, `🙃`, `🥲`]
                    await message.channel.send(`${randmessage[Math.floor(Math.random()*randmessage.length)]}`);
                    await message.react(randemoji[Math.floor(Math.random()*randemoji.length)])
                }
            }
            if (Number(result) === Number(Number(currentNumber) + 1)) {
                if (Number(result) === Number(highScore) + 1 && Number(result) !== 1)
                    await message.react(`✨`);
                //set new number
                await kevy.set(`counting_${message.guild.id}`, Number(Number(currentNumber) + 1) + `_` + highScore + `_${message.author.id}`);
                
                //react
                await message.react(`✅`);
                lastValidMessage = message;
                // let math_emojis = [`➕`, `✖️`, `➗`, `➖`];
                // if (math_req === true)
                //     await message.react(math_emojis[Math.floor(Math.random()*math_emojis.length)]);
                // console.log(Number(Number(currentNumber) + 1) + `_` + highScore + `_${context.params.event.author.id}`);
            } else {
                if (Number(currentNumber) > 0) {
                    //if current number is higher than highScore
                    if (Number(currentNumber) > highScore) {
                        //fail message, new High Score
                        const randmessage = [`Ah, Be careful <@${message.author.id}>!`, `Nooo... come on <@${message.author.id}>!`, `That's fine <@${message.author.id}>!`, `I'm quitting! ok, obviously I can't do that... but c'mon <@${message.author.id}>!`, `You did fine <@${message.author.id}>... by ending the game!!`, `Gosh! you are really good at this <@${message.author.id}>!`]
                        if (lastValidMessage !== null)
                            await lastValidMessage.react(`👑`);
                        await message.react(`❌`);
                        await message.channel.send(`${randmessage[Math.floor(Math.random()*randmessage.length)]} Anyways, New **High Score: ${currentNumber}**.`);
                        //set new score
                        await kevy.set(`counting_${message.guild.id}`, Number(0) + `_` + currentNumber + `_${message.author.id}`);
                        return await message.channel.setName(`${currentNumber}_counting`);

                    } else if (Number(currentNumber) > highScore - 10) {
                        const randmessage = [`Dang it <@${message.author.id}> B(`, `Ah <@${message.author.id}>`, `:( noo <@${message.author.id}> but why?`, `Okey... well done <@${message.author.id}>`, `Noooo!!! nice job <@${message.author.id}>`, `What have you done <@${message.author.id}>?? I wanna cry!!`]
                            
                        await message.channel.send(`${randmessage[Math.floor(Math.random()*randmessage.length)]} So close to high score was only ${highScore - Number(currentNumber) + 1} left...\nyou did fine: ${Number(currentNumber)}`);
                        //set new score
                        await kevy.set(`counting_${message.guild.id}`, Number(0) + `_` + highScore + `_${message.author.id}`);
                    } else {
                        //fail message
                        const randmessage = [`use math next time!`, `ruined it.`, `very good at counting :D`, `nice job...`, `that's fine, you aren't the first`, `alright...`, `you people should just give up!`, `Did you really fall for that?`, `NICE!`]
                            
                        await message.channel.send(`<@${message.author.id}> ${randmessage[Math.floor(Math.random()*randmessage.length)]}\n current high score is ${highScore}\n you hit ${Number(currentNumber)}!`);
                        //set new score
                        await kevy.set(`counting_${message.guild.id}`, Number(0) + `_` + highScore + `_${message.author.id}`);
                    }
                    //react message
                }
                await message.react(`❌`);
            }
        })();
    }
    
}
                                                                    