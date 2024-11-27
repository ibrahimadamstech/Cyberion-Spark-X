
















































































































/*"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/framework/zokou");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/CYBERION;;;/g,"");
const prefixe = conf.PREFIXE;


async function authentification() {
    try {
       
        //console.log("le data "+data)
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
            //console.log(session)
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalide " + e);
        return;
    }
}
authentification();
const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});
setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Cyberion-Spark-X', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
             auth: stateauth: {
              creds: state.creds,
                 caching makes the store faster to send/recv messages 
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
          
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);
        setInterval(() => { store.writeToFile("store.json"); }, 3000);
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message)
                return;
            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];
            /* const FranceKing='254740271632';
             const CarlTech1='254770954948';
             const CarlTech2='254740271632'*/
            /*  var superUser=[servBot,CarlTech,CarlTech1,luffy].map((s)=>s.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);
              var dev =[CarlTech,CarlTech1,CarlTech2].map((t)=>t.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            //ms.message.extendedTextMessage?.contextInfo?.mentionedJid
            // ms.message.extendedTextMessage?.contextInfo?.quotedMessage.
            var mr = ms.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;
            const CarlTech = '254740271632';
            const CarlTech1 = '254770954948';
            const CarlTech2 = "254740271632";
            const CarlTech3 = '254770954948';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, CarlTech, CarlTech1, CarlTech2, CarlTech3, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [CarlTech, CarlTech1,CarlTech2,CarlTech3].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            console.log("\t [][]...{Cyberion-Spark-X}...[][]");
            console.log("=========== New message ===========");
            if (verifGroupe) {
                console.log("message from the group : " + nomGroupe);
            }
            console.log("message sent By : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("message type : " + mtype);
            console.log("------ message content ------");
            console.log(texte);
            /**  
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (m of membreGroupe) {
                    if (m.admin == null)
                        continue;
                    admin.push(m.id);
                }
                // else{admin= false;}
                return admin;
            }

            var etat =conf.ETAT;
            if(etat==1)
            {await zk.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2)
            {await zk.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3)
            {
            await zk.sendPresenceUpdate("recording",origineMessage);
            }
            else
            {
                await zk.sendPresenceUpdate("unavailable",origineMessage);
            }

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            //  const verifAdmin = verifGroupe ? await mbre.filter(v => v.admin !== null).map(v => v.id) : ''
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;
            /** ** */
            /** ***** 
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
           
         
            const lien = conf.URL.split(',')  

            
            // Utiliser une boucle for...of pour parcourir les liens
function mybotpic() {
    // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     const indiceAleatoire = Math.floor(Math.random() * lien.length);
     // Récupérer le lien correspondant à l'indice aléatoire
     const lienAleatoire = lien[indiceAleatoire];
     return lienAleatoire;
  }
            var commandeOptions = {
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            
            };


            /************************ anti-delete-message 

            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {

                if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { console.log('Message supprimer me concernant') ; return }
        
                                console.log(`Message supprimer`)
                                let key =  ms.message.protocolMessage.key ;
                                
        
                               try {
        
                                  let st = './store.json' ;
        
                                const data = fs.readFileSync(st, 'utf8');
        
                                const jsonData = JSON.parse(data);
        
                                    let message = jsonData.messages[key.remoteJid] ;
                                
                                    let msg ;
        
                                    for (let i = 0 ; i < message.length ; i++) {
        
                                        if (message[i].key.id === key.id) {
                                            
                                            msg = message[i] ;
        
                                            break 
                                        }
        
                                    } 
        
                                  //  console.log(msg)
        
                                    if(msg === null || !msg ||msg === 'undefined') {console.log('Message non trouver') ; return } 
        
                                await zk.sendMessage(idBot,{ image : { url : './media/deleted-message.jpg'},caption : `        😈Anti-delete-message😈\n Message from @${msg.key.participant.split('@')[0]}​` , mentions : [msg.key.participant]},)
                                .then( () => {
                                    zk.sendMessage(idBot,{forward : msg},{quoted : msg}) ;
                                })
                               
                              
        
                               } catch (e) {
                                    console.log(e)
                               }
                            }
        
            /** ****** gestion auto-status  
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                /* await zk.readMessages([ms.key]);
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
                /** *************** */
                // console.log("*nouveau status* ");
            }
            /** ******fin auto-status 
            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }
            
 //---------------------------------------rang-count--------------------------------
             if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
  const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
  try {
    await ajouterOuMettreAJourUserData(auteurMessage);
  } catch (e) {
    console.error(e);
  }
              }
            
                /////////////////////////////   Mentions /////////////////////////////////////////
         
              try {
        
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))    /*texte.includes(idBot.split('@')[0]) || texte.includes(conf.NUMERO_OWNER) {
            
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
            
                    if(superUser) {console.log('hummm') ; return ;} 
                    
                    let mbd = require('./bdd/mention') ;
            
                    let alldata = await mbd.recupererToutesLesValeurs() ;
            
                        let data = alldata[0] ;
            
                    if ( data.status === 'non') { console.log('mention pas actifs') ; return ;}
            
                    let msg ;
            
                    if (data.type.toLocaleLowerCase() === 'image') {
            
                        msg = {
                                image : { url : data.url},
                                caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
            
                            msg = {
                                    video : {   url : data.url},
                                    caption : data.message
                            }
            
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
            
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                          });
            
                          const stickerBuffer2 = await stickerMess.toBuffer();
            
                          msg = {
                                sticker : stickerBuffer2 
                          }
            
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
            
                            msg = {
            
                                audio : { url : data.url } ,
                                mimetype:'audio/mp4',
                                 }
                        
                    }
            
                    zk.sendMessage(origineMessage,msg,{quoted : ms})
            
                }
            } catch (error) {
                
            } 


     //anti-lien
     try {
        const yes = await verifierEtatJid(origineMessage)
        if (texte.includes('https://') && verifGroupe &&  yes  ) {

         console.log("lien detecté")
            var verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
            
             if(superUser || verifAdmin || !verifZokAdmin  ) { console.log('je fais rien'); return};
                        
                                    const key = {
                                        remoteJid: origineMessage,
                                        fromMe: false,
                                        id: ms.key.id,
                                        participant: auteurMessage
                                    };
                                    var txt = "link detected, \n";
                                   // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
                                    const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
                                    var sticker = new Sticker(gifLink, {
                                        pack: 'Cyberion-Spark-X',
                                        author: conf.OWNER_NAME,
                                        type: StickerTypes.FULL,
                                        categories: ['🤩', '🎉'],
                                        id: '12345',
                                        quality: 50,
                                        background: '#000000'
                                    });
                                    await sticker.toFile("st1.webp");
                                    // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
                                    var action = await recupererActionJid(origineMessage);

                                      if (action === 'remove') {

                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

                                    await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                    (0, baileys_1.delay)(800);
                                    await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                    try {
                                        await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                    }
                                    catch (e) {
                                        console.log("antiien ") + e;
                                    }
                                    await zk.sendMessage(origineMessage, { delete: key });
                                    await fs.unlink("st1.webp"); } 
                                        
                                       else if (action === 'delete') {
                                        txt += `Goodbye \n @${auteurMessage.split("@")[0]} Any external link is totally rolled out here!.`;
                                        // await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
                                       await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                       await zk.sendMessage(origineMessage, { delete: key });
                                       await fs.unlink("st1.webp");

                                    } else if(action === 'warn') {
                                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;

                            let warn = await getWarnCountByJID(auteurMessage) ; 
                            let warnlimit = conf.WARN_COUNT
                         if ( warn >= warnlimit) { 
                          var kikmsg = `link detected , you will be remove because of reaching warn-limit`;
                            
                             await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


                             await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                             await zk.sendMessage(origineMessage, { delete: key });


                            } else {
                                var rest = warnlimit - warn ;
                              var  msg = `Link detected , your warn_count was upgrade ;\n rest : ${rest} `;

                              await ajouterUtilisateurAvecWarnCount(auteurMessage)

                              await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                              await zk.sendMessage(origineMessage, { delete: key });

                            }
                                    }
                                }
                                
                            }
                        
                    
                
            
        
    
    catch (e) {
        console.log("bdd err " + e);
    }
    


    /** *************************anti-bot******************************************** 
    try {
        const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
        const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
        if (botMsg || baileysMsg) {

            if (mtype === 'reactionMessage') { console.log('Je ne reagis pas au reactions') ; return} ;
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if(!antibotactiver) {return};

            if( verifAdmin || auteurMessage === idBot  ) { console.log('je fais rien'); return};
                        
            const key = {
                remoteJid: origineMessage,
                fromMe: false,
                id: ms.key.id,
                participant: auteurMessage
            };
            var txt = "bot detected, \n";
           // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
            const gifLink = "https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif";
            var sticker = new Sticker(gifLink, {
                pack: 'Cyberion-Spark-X',
                author: conf.OWNER_NAME,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
            });
            await sticker.toFile("st1.webp");
            // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
            var action = await atbrecupererActionJid(origineMessage);

              if (action === 'remove') {

                txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

            await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            (0, baileys_1.delay)(800);
            await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            }
            catch (e) {
                console.log("antibot ") + e;
            }
            await zk.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp"); } 
                
               else if (action === 'delete') {
                txt += `message delete \n @${auteurMessage.split("@")[0]} Avoid sending link.`;
                //await zk.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
               await zk.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
               await zk.sendMessage(origineMessage, { delete: key });
               await fs.unlink("st1.webp");

            } else if(action === 'warn') {
                const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./bdd/warn') ;

    let warn = await getWarnCountByJID(auteurMessage) ; 
    let warnlimit = conf.WARN_COUNT
 if ( warn >= warnlimit) { 
  var kikmsg = `bot detected ;you will be remove because of reaching warn-limit`;
    
     await zk.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


     await zk.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
     await zk.sendMessage(origineMessage, { delete: key });


    } else {
        var rest = warnlimit - warn ;
      var  msg = `bot detected , your warn_count was upgraded ;\n rest : ${rest} `;

      await ajouterUtilisateurAvecWarnCount(auteurMessage)

      await zk.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
      await zk.sendMessage(origineMessage, { delete: key });

    }
                }
        }
    }
    catch (er) {
        console.log('.... ' + er);
    }        
             
         
            /////////////////////////
            
            //execution des commandes   
            if (verifCom) {
                //await await zk.readMessages(ms.key);
                const cd = evt.cm.find((zokou) => zokou.nomCom === (com));
                if (cd) {
                    try {

            if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                return;
            }

                         /******************* PM_PERMT**************

            if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                repondre("You don't have acces to Cyberion Spark X") ; return }
            ///////////////////////////////

             
            /*****************************banGroup  
            if (!superUser && verifGroupe) {

                 let req = await isGroupBanned(origineMessage);
                    
                        if (req) { return }
            }

              /***************************  ONLY-ADMIN  

            if(!verifAdmin && verifGroupe) {
                 let req = await isGroupOnlyAdmin(origineMessage);
                    
                        if (req) {  return }}

              /**********************banuser 
         
            
                if(!superUser) {
                    let req = await isUserBanned(auteurMessage);
                    
                        if (req) {repondre("Your access to Cyberion Spark X is denied"); return}
                    

                } 

                        reagir(origineMessage, zk, ms, cd.reaction);
                        cd.fonction(origineMessage, zk, commandeOptions);
                    }
                    catch (e) {
                        console.log("😡😡 " + e);
                        zk.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
            //fin exécution commandes
        });
        //fin événement message

/******** evenement groupe update ***************
const { recupevents } = require('./bdd/welcome'); 

zk.ev.on('group-participants.update', async (group) => {
    console.log(group);

    let ppgroup;
    try {
        ppgroup = await zk.profilePictureUrl(group.id, 'image');
    } catch {
        ppgroup = 'https://telegra.ph/file/cc5fd0e19ae11164bd813.jpg';
    }

    try {
        const metadata = await zk.groupMetadata(group.id);

        if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
            let msg =`╔════◇◇◇═════╗
║ welcome to new(s) member(s)
║ *New(s) Member(s) :*
`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `║ @${membre.split("@")[0]}\n`;
            }

            msg += `║
╚════◇◇◇═════╝
◇ *Descriptioon*   ◇

${metadata.desc}\n\n Cyberion-Spark-X.`;

            zk.sendMessage(group.id, { image: { url: ppgroup }, caption: msg, mentions: membres });
        } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
            let msg = `Goodbye to that Fallen soldier, Powered by *𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡*; \n`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `@${membre.split("@")[0]}\n`;
            }

            zk.sendMessage(group.id, { text: msg, mentions: membres });

        } else if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on') ) {
            //  console.log(zk.user.id)
          if (group.author == metadata.owner || group.author  == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id)  || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


         await   zk.groupParticipantsUpdate(group.id ,[group.author,group.participants[0]],"demote") ;

         zk.sendMessage(
              group.id,
              {
                text : `@${(group.author).split("@")[0]} has violated the anti-promotion rule, therefore both ${group.author.split("@")[0]} and @${(group.participants[0]).split("@")[0]} have been removed from administrative rights.`,
                mentions : [group.author,group.participants[0]]
              }
         )

        } else if (group.action == 'demote' && (await recupevents(group.id, "antidemote") == 'on') ) {

            if (group.author == metadata.owner || group.author ==  conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(zk.user.id) || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


           await  zk.groupParticipantsUpdate(group.id ,[group.author],"demote") ;
           await zk.groupParticipantsUpdate(group.id , [group.participants[0]] , "promote")

           zk.sendMessage(
                group.id,
                {
                  text : `@${(group.author).split("@")[0]} has violated the anti-demotion rule by removing @${(group.participants[0]).split("@")[0]}. Consequently, he has been stripped of administrative rights.` ,
                  mentions : [group.author,group.participants[0]]
                }
           )

     } 

    } catch (e) {
        console.error(e);
    }
});

/******** fin d'evenement groupe update ************************



    /*****************************Cron setup 

        
    async  function activateCrons() {
        const cron = require('node-cron');
        const { getCron } = require('./bdd/cron');

          let crons = await getCron();
          console.log(crons);
          if (crons.length > 0) {
        
            for (let i = 0; i < crons.length; i++) {
        
              if (crons[i].mute_at != null) {
                let set = crons[i].mute_at.split(':');

                console.log(`etablissement d'un automute pour ${crons[i].group_id} a ${set[0]} H ${set[1]}`)

                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                  await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Hello, it's time to close the group; sayonara." });

                }, {
                    timezone: "Africa/Nairobi"
                  });
              }
        
              if (crons[i].unmute_at != null) {
                let set = crons[i].unmute_at.split(':');

                console.log(`etablissement d'un autounmute pour ${set[0]} H ${set[1]} `)
        
                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {

                  await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement');

                  zk.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Good morning; It's time to open the group." });

                 
                },{
                    timezone: "Africa/Nairobi"
                  });
              }
        
            }
          } else {
            console.log('Les crons n\'ont pas été activés');
          }

          return
        }

        
        //événement contact
        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    }
                    else {
                        store.contacts[contact.id] = contact;
                    }
                }
                return;
            };
            insertContact(contacts);
        });
        //fin événement contact 
        //événement connexion
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ Connexion en cours...");
            }
            else if (connection === 'open') {
                console.log("✅ connexion reussie! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("le bot est en ligne 🕸\n\n");
                //chargement des commandes 
                console.log("chargement des commandes ...\n");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            console.log(fichier + " installé ✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} n'a pas pu être chargé pour les raisons suivantes : ${e}`);
                        } /* require(__dirname + "/commandes/" + fichier);
                         console.log(fichier + " installé ✔️")
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                }
                else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                }
                else {
                    md = "undefined";
                }
                console.log("chargement des commandes terminé ✅");

                await activateCrons();
                
                if((conf.DP).toLowerCase() === 'yes') {     
                let cmsg = `
 ┌─────═━┈┈━    ═─═━┈┈━═────┐
   *☢️𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫 𝗔𝗖𝗧𝗜𝗩𝗘🌐*
 └─────═━┈┈━    ═───────═───┘
    ┏▪︎▰▱▰▱▰▱▰▱▰▱▰▱▰▱
    ┃  🕵Creator: *CARLTECH*
    ┃  ❂──────────────────❂
    ┃  💫Prefix : 〔${prefixe}〕
    ┃  📱Mode : 〚${md}〛
    ┃  ⚙️Created on : *23.8.2024*
    ┃  📃Total Commands : ${evt.cm.length}
    ✰⁠⁠⁠⁠▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰✰
 └─────═━┈┈━═─⊷─⊷═━┈┈━═─────┘
         *𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫*`;
                await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session id érronée veuillez rescanner le qr svp ...');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('connexion au serveur perdue 😞 ,,, reconnexion en cours ... ');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                }   else {

                    console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion) ;         
                    //repondre("* Redémarrage du bot en cour ...*");

                                const {exec}=require("child_process") ;

                                exec("pm2 restart all");            
                }
                // sleep(50000)
                console.log("hum " + connection);
                main(); //console.log(session)
            }
        });
        //fin événement connexion
        //événement authentification 
        zk.ev.on("creds.update", saveCreds);
        //fin événement authentification 
        //
        /** ************* 
        //fonctions utiles
        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            // save to file
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };


        zk.awaitForMessage = async (options = {}) =>{
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));
        
                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined
        
                /**
                 * 
                 * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
                
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
        
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                }
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        }



        // fin fonctions utiles
        /** ************* 
        return zk;
    }
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);*/
'use strict';const _0x2aa810=_0x3dbc;(function(_0xc6cf8,_0x45749f){const _0x1a4019=_0x3dbc,_0x512a49=_0xc6cf8();while(!![]){try{const _0x1071c4=parseInt(_0x1a4019(0x1e0))/0x1+parseInt(_0x1a4019(0x289))/0x2*(parseInt(_0x1a4019(0x279))/0x3)+parseInt(_0x1a4019(0x285))/0x4+parseInt(_0x1a4019(0x1b0))/0x5+parseInt(_0x1a4019(0x1a3))/0x6*(parseInt(_0x1a4019(0x203))/0x7)+parseInt(_0x1a4019(0x242))/0x8+-parseInt(_0x1a4019(0x241))/0x9*(parseInt(_0x1a4019(0x221))/0xa);if(_0x1071c4===_0x45749f)break;else _0x512a49['push'](_0x512a49['shift']());}catch(_0x5a738b){_0x512a49['push'](_0x512a49['shift']());}}}(_0x41c2,0xced3f));function _0x20d2(_0xb707c8,_0x4a6059){const _0x2edfae=_0x334c();return _0x20d2=function(_0x172ea9,_0x3849ba){_0x172ea9=_0x172ea9-0x19b;let _0x72223e=_0x2edfae[_0x172ea9];return _0x72223e;},_0x20d2(_0xb707c8,_0x4a6059);}const _0x426d44=_0x20d2;(function(_0x1932f9,_0x5085fc){const _0x22236f=_0x3dbc,_0x56f944=_0x20d2,_0x3d8bdc=_0x1932f9();while(!![]){try{const _0xefd689=-parseInt(_0x56f944(0x239))/0x1+-parseInt(_0x56f944(0x299))/0x2+-parseInt(_0x56f944(0x1dd))/0x3+parseInt(_0x56f944(0x21c))/0x4+parseInt(_0x56f944(0x218))/0x5+parseInt(_0x56f944(0x1e1))/0x6+-parseInt(_0x56f944(0x1d0))/0x7;if(_0xefd689===_0x5085fc)break;else _0x3d8bdc[_0x22236f(0x1cb)](_0x3d8bdc[_0x22236f(0x27c)]());}catch(_0x1f0467){_0x3d8bdc[_0x22236f(0x1cb)](_0x3d8bdc[_0x22236f(0x27c)]());}}}(_0x334c,0xcd569));var __createBinding=this&&this[_0x426d44(0x1b8)]||(Object[_0x426d44(0x29a)]?function(_0x451a7d,_0x469c6d,_0x5f2705,_0x59f8f4){const _0x59fc59=_0x3dbc,_0x3a78b5=_0x426d44;if(_0x59f8f4===undefined)_0x59f8f4=_0x5f2705;var _0x6d3550=Object[_0x3a78b5(0x1d7)](_0x469c6d,_0x5f2705);(!_0x6d3550||(_0x3a78b5(0x1fe)in _0x6d3550?!_0x469c6d[_0x59fc59(0x264)]:_0x6d3550[_0x3a78b5(0x2a1)]||_0x6d3550[_0x3a78b5(0x202)]))&&(_0x6d3550={'enumerable':!![],'get':function(){return _0x469c6d[_0x5f2705];}}),Object[_0x3a78b5(0x285)](_0x451a7d,_0x59f8f4,_0x6d3550);}:function(_0x1dc712,_0x350e7b,_0x41d56a,_0x29048a){if(_0x29048a===undefined)_0x29048a=_0x41d56a;_0x1dc712[_0x29048a]=_0x350e7b[_0x41d56a];}),__setModuleDefault=this&&this['__setModuleDefault']||(Object[_0x2aa810(0x1c5)]?function(_0x38744d,_0x147a42){const _0x9113c1=_0x426d44;Object[_0x9113c1(0x285)](_0x38744d,_0x9113c1(0x27b),{'enumerable':!![],'value':_0x147a42});}:function(_0x4712ed,_0x2ae33e){const _0xc6455b=_0x426d44;_0x4712ed[_0xc6455b(0x27b)]=_0x2ae33e;}),__importStar=this&&this[_0x426d44(0x25d)]||function(_0x599e1e){const _0xfd9e90=_0x426d44;if(_0x599e1e&&_0x599e1e[_0xfd9e90(0x237)])return _0x599e1e;var _0x51449b={};if(_0x599e1e!=null){for(var _0x203a5d in _0x599e1e)if(_0x203a5d!==_0xfd9e90(0x27b)&&Object[_0xfd9e90(0x297)][_0xfd9e90(0x281)]['call'](_0x599e1e,_0x203a5d))__createBinding(_0x51449b,_0x599e1e,_0x203a5d);}return __setModuleDefault(_0x51449b,_0x599e1e),_0x51449b;},__importDefault=this&&this[_0x426d44(0x21f)]||function(_0x2fe566){const _0x5c2271=_0x426d44;return _0x2fe566&&_0x2fe566[_0x5c2271(0x237)]?_0x2fe566:{'default':_0x2fe566};};Object['defineProperty'](exports,_0x426d44(0x237),{'value':!![]});const baileys_1=__importStar(require(_0x426d44(0x226))),logger_1=__importDefault(require(_0x426d44(0x1c0))),logger=logger_1[_0x426d44(0x27b)][_0x426d44(0x19d)]({});logger[_0x2aa810(0x1fa)]=_0x426d44(0x29b);const pino=require(_0x426d44(0x1f6)),boom_1=require(_0x2aa810(0x26a)),conf=require(_0x426d44(0x21a)),axios=require(_0x426d44(0x1db)),moment=require(_0x426d44(0x280));function _0x334c(){const _0x1b8ea8=_0x2aa810,_0x1e09ad=[_0x1b8ea8(0x25d),_0x1b8ea8(0x1c5),'silent',_0x1b8ea8(0x257),_0x1b8ea8(0x191),_0x1b8ea8(0x23a),_0x1b8ea8(0x295),'redemarrage\x20sur\x20le\x20coup\x20de\x20l\x27erreur\x20\x20',_0x1b8ea8(0x197),'announcement',_0x1b8ea8(0x247),'PREFIXE',_0x1b8ea8(0x1a1),'cache',_0x1b8ea8(0x1ed),_0x1b8ea8(0x239),_0x1b8ea8(0x182),'key',_0x1b8ea8(0x1f2),_0x1b8ea8(0x265),_0x1b8ea8(0x1bb),_0x1b8ea8(0x227),_0x1b8ea8(0x194),_0x1b8ea8(0x236),'mentionedJid',_0x1b8ea8(0x19b),'Options\x20must\x20be\x20an\x20object',_0x1b8ea8(0x1ee),_0x1b8ea8(0x274),_0x1b8ea8(0x1e9),_0x1b8ea8(0x18e),_0x1b8ea8(0x26e),_0x1b8ea8(0x21a),_0x1b8ea8(0x19d),_0x1b8ea8(0x199),_0x1b8ea8(0x271),'map',_0x1b8ea8(0x25c),_0x1b8ea8(0x261),_0x1b8ea8(0x273),_0x1b8ea8(0x1e7),_0x1b8ea8(0x200),_0x1b8ea8(0x21e),_0x1b8ea8(0x268),_0x1b8ea8(0x27e),_0x1b8ea8(0x1d7),_0x1b8ea8(0x1d3),_0x1b8ea8(0x18a),_0x1b8ea8(0x1da),'open',_0x1b8ea8(0x284),_0x1b8ea8(0x262),_0x1b8ea8(0x183),_0x1b8ea8(0x277),_0x1b8ea8(0x1d0),_0x1b8ea8(0x19a),_0x1b8ea8(0x297),_0x1b8ea8(0x1f0),_0x1b8ea8(0x21c),_0x1b8ea8(0x21f),_0x1b8ea8(0x22f),_0x1b8ea8(0x288),'BAES','110768xWuldY',_0x1b8ea8(0x240),_0x1b8ea8(0x287),'add',_0x1b8ea8(0x28a),_0x1b8ea8(0x1c2),'message\x20deleted\x20\x0a\x20@',_0x1b8ea8(0x1a0),'mtype',_0x1b8ea8(0x281),'Cas\x20de\x20superUser\x20je\x20fais\x20rien',_0x1b8ea8(0x1c4),'singleSelectReply',_0x1b8ea8(0x201),_0x1b8ea8(0x1cb),_0x1b8ea8(0x283),_0x1b8ea8(0x1ce),_0x1b8ea8(0x1b3),_0x1b8ea8(0x296),_0x1b8ea8(0x24f),_0x1b8ea8(0x1fd),_0x1b8ea8(0x280),_0x1b8ea8(0x184),'demote',_0x1b8ea8(0x231),_0x1b8ea8(0x27c),_0x1b8ea8(0x244),_0x1b8ea8(0x192),_0x1b8ea8(0x1ba),_0x1b8ea8(0x1c3),_0x1b8ea8(0x1d5),_0x1b8ea8(0x258),_0x1b8ea8(0x290),_0x1b8ea8(0x1df),_0x1b8ea8(0x25f),_0x1b8ea8(0x22d),_0x1b8ea8(0x266),'participants','pino',_0x1b8ea8(0x251),_0x1b8ea8(0x24a),_0x1b8ea8(0x1d8),_0x1b8ea8(0x27b),'NUMERO_OWNER',_0x1b8ea8(0x1f8),_0x1b8ea8(0x190),'get',_0x1b8ea8(0x1dd),_0x1b8ea8(0x1c7),_0x1b8ea8(0x213),_0x1b8ea8(0x195),_0x1b8ea8(0x26d),'\x20removed\x20from\x20group.',_0x1b8ea8(0x1b2),'ℹ️Cyberion\x20is\x20connecting...',_0x1b8ea8(0x185),_0x1b8ea8(0x212),_0x1b8ea8(0x1de),_0x1b8ea8(0x28d),'Cyberion',_0x1b8ea8(0x1b1),_0x1b8ea8(0x198),_0x1b8ea8(0x19f),_0x1b8ea8(0x276),_0x1b8ea8(0x1a5),_0x1b8ea8(0x1be),_0x1b8ea8(0x272),'owner',_0x1b8ea8(0x1e3),'/Ibrahim/adams',_0x1b8ea8(0x24d),_0x1b8ea8(0x1a4),'5911670WeHFqm',_0x1b8ea8(0x214),_0x1b8ea8(0x25e),'extendedTextMessage',_0x1b8ea8(0x250),_0x1b8ea8(0x1b6),'Throttling\x20reactions\x20to\x20prevent\x20overflow.',_0x1b8ea8(0x232),_0x1b8ea8(0x1e2),_0x1b8ea8(0x1e4),'etablissement\x20d\x27un\x20automute\x20pour\x20',_0x1b8ea8(0x187),_0x1b8ea8(0x1e6),_0x1b8ea8(0x224),'@whiskeysockets/baileys',_0x1b8ea8(0x1bf),_0x1b8ea8(0x218),_0x1b8ea8(0x1a2),_0x1b8ea8(0x1f3),_0x1b8ea8(0x20a),'@s.whatsapp.net','groupSettingUpdate',_0x1b8ea8(0x24c),'Session\x20id\x20error,\x20rescan\x20again...',_0x1b8ea8(0x249),'readFileSync',_0x1b8ea8(0x1eb),_0x1b8ea8(0x1f6),_0x1b8ea8(0x225),_0x1b8ea8(0x204),'filter','__esModule',_0x1b8ea8(0x292),_0x1b8ea8(0x196),_0x1b8ea8(0x1b8),_0x1b8ea8(0x1f9),_0x1b8ea8(0x238),_0x1b8ea8(0x27f),_0x1b8ea8(0x1d4),_0x1b8ea8(0x20c),_0x1b8ea8(0x263),_0x1b8ea8(0x1d9),'delay','/scs',_0x1b8ea8(0x229),_0x1b8ea8(0x186),'Commands\x20Installation\x20Completed\x20✅',_0x1b8ea8(0x1b7),_0x1b8ea8(0x1cd),_0x1b8ea8(0x1f4),_0x1b8ea8(0x1c9),'Bot\x27s\x20user\x20ID\x20not\x20available.\x20Skipping\x20reaction.',_0x1b8ea8(0x233),_0x1b8ea8(0x27a),_0x1b8ea8(0x1ab),_0x1b8ea8(0x18b),_0x1b8ea8(0x188),_0x1b8ea8(0x28c),_0x1b8ea8(0x1fe),_0x1b8ea8(0x217),'Successfully\x20reacted\x20to\x20status\x20update\x20by\x20',_0x1b8ea8(0x28b),_0x1b8ea8(0x1ac),'file-type','reactionMessage',_0x1b8ea8(0x1fb),'bot\x20detected\x20;you\x20will\x20be\x20remove\x20because\x20of\x20reaching\x20warn-limit','safari',_0x1b8ea8(0x20b),_0x1b8ea8(0x20e),'watchFile','unmute_at',_0x1b8ea8(0x21d),_0x1b8ea8(0x291),'❒\x20*READ\x20THE\x20GROUP\x20DESCRIPTION\x20TO\x20AVOID\x20GETTING\x20REMOVED*\x20','from',_0x1b8ea8(0x1a8),_0x1b8ea8(0x256),'connection.update',_0x1b8ea8(0x1a6),_0x1b8ea8(0x24b),_0x1b8ea8(0x1a7),_0x1b8ea8(0x1e8),_0x1b8ea8(0x1dc),_0x1b8ea8(0x22e),_0x1b8ea8(0x1f5),_0x1b8ea8(0x1b5),'Cyberion\x20is\x20Online\x20🕸\x0a\x0a',_0x1b8ea8(0x1b4),'floor',_0x1b8ea8(0x20f),_0x1b8ea8(0x1aa),'connexion\x20réplacée\x20,,,\x20une\x20sesssion\x20est\x20déjà\x20ouverte\x20veuillez\x20la\x20fermer\x20svp\x20!!!',_0x1b8ea8(0x1e5),'./lib/antibot',_0x1b8ea8(0x23f),_0x1b8ea8(0x23d),_0x1b8ea8(0x1c0),'\x20could\x20not\x20be\x20installed\x20due\x20to\x20:\x20',_0x1b8ea8(0x226),_0x1b8ea8(0x26f),_0x1b8ea8(0x1ca),_0x1b8ea8(0x193),_0x1b8ea8(0x1a9),_0x1b8ea8(0x1b9),_0x1b8ea8(0x230),_0x1b8ea8(0x253),_0x1b8ea8(0x206),_0x1b8ea8(0x220),_0x1b8ea8(0x294),_0x1b8ea8(0x28f),_0x1b8ea8(0x245),'Detected\x20status\x20update\x20from:',_0x1b8ea8(0x293),_0x1b8ea8(0x237),_0x1b8ea8(0x202),'DisconnectReason',_0x1b8ea8(0x19e),_0x1b8ea8(0x1f1),'\x0a\x20\x20\x20\x20┃\x20\x20✨️Bot\x20Name:\x20',_0x1b8ea8(0x1fc),_0x1b8ea8(0x278),_0x1b8ea8(0x210),_0x1b8ea8(0x209),'forEach',_0x1b8ea8(0x21b),'./lib/antilien',_0x1b8ea8(0x275),_0x1b8ea8(0x26b)];return _0x334c=function(){return _0x1e09ad;},_0x334c();}let fs=require(_0x426d44(0x27f)),path=require(_0x2aa810(0x1ea));function _0x3dbc(_0x326abf,_0x5100f2){const _0x41c2ed=_0x41c2();return _0x3dbc=function(_0x3dbc46,_0x111383){_0x3dbc46=_0x3dbc46-0x182;let _0x14fe1a=_0x41c2ed[_0x3dbc46];return _0x14fe1a;},_0x3dbc(_0x326abf,_0x5100f2);}const FileType=require(_0x426d44(0x257)),{Sticker,createSticker,StickerTypes}=require('wa-sticker-formatter'),{verifierEtatJid,recupererActionJid}=require(_0x426d44(0x296)),{atbverifierEtatJid,atbrecupererActionJid}=require(_0x426d44(0x276));let evt=require(__dirname+_0x426d44(0x215));const {isUserBanned,addUserToBanList,removeUserFromBanList}=require(_0x2aa810(0x22a)),{addGroupToBanList,isGroupBanned,removeGroupFromBanList}=require(_0x2aa810(0x18d)),{isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList}=require(_0x2aa810(0x25a));let {reagir}=require(__dirname+'/Ibrahim/app');var session=conf[_0x2aa810(0x208)][_0x426d44(0x28e)](/CYBERION;;;/g,'');const prefixe=conf[_0x426d44(0x19c)],more=String[_0x426d44(0x1f3)](0x200e),readmore=more[_0x2aa810(0x259)](0xfa1),herokuAppName=process[_0x2aa810(0x227)][_0x426d44(0x1a1)]||_0x426d44(0x1ef),herokuAppLink=process[_0x426d44(0x1a6)][_0x426d44(0x214)]||_0x2aa810(0x20d)+herokuAppName,botOwner=process[_0x426d44(0x1a6)][_0x2aa810(0x189)]||_0x2aa810(0x255);async function authentification(){const _0xa7151b=_0x2aa810,_0x20498b=_0x426d44;try{if(!fs[_0xa7151b(0x234)](__dirname+'/Session/creds.json'))console[_0x20498b(0x279)](_0x20498b(0x1ac)),await fs['writeFileSync'](__dirname+_0x20498b(0x248),atob(session),_0x20498b(0x1d1));else fs[_0xa7151b(0x234)](__dirname+_0x20498b(0x248))&&session!=_0x20498b(0x256)&&await fs[_0x20498b(0x1e2)](__dirname+_0x20498b(0x248),atob(session),_0x20498b(0x1d1));}catch(_0x131465){console[_0x20498b(0x279)](_0x20498b(0x295)+_0x131465);return;}}authentification();const store=(0x0,baileys_1[_0x426d44(0x1e6)])({'logger':pino()[_0x426d44(0x19d)]({'level':_0x2aa810(0x1e1),'stream':_0x426d44(0x272)})});function _0x41c2(){const _0x24f231=['notify','sendMessage','antibot\x20','error','downloadContentFromMessage','level','concat','videoMessage','goodbye','fonction','assign','Hello,\x20it\x27s\x20time\x20to\x20close\x20the\x20group;\x20sayonara.','306960NiKmAA','length','203lTqseG','listResponseMessage','message\x20provenant\x20du\x20groupe\x20:\x20','ext','creds','session','messageContextInfo','\x20:\x20','endsWith','action','https://dashboard.heroku.com/apps/','__importStar','store','fromBuffer','Deleted\x20message\x20detected.','\x0a\x20\x20\x20\x20┃\x20\x20🔮','./lib/warn','messages','nomCom','delay','server','hum\x20','makeCacheableSignalKeyStore','\x20and\x20@','Session\x20Invalid\x20','Je\x20ne\x20reagis\x20pas\x20au\x20reactions','pm2\x20restart\x20all','startsWith','off','.\x20Consequently,\x20he\x20has\x20been\x20stripped\x20of\x20administrative\x20rights.','15476380MyqWZx','connectionClosed','contacts.upsert','composing','status@broadcast','default','env','redémarrage\x20en\x20cours\x20▶️','ChatJid\x20must\x20be\x20a\x20string','./lib/banUser','unavailable','!!!\x20connexion\x20fermée,\x20reconnexion\x20en\x20cours\x20...','fromCharCode','text','type','hasOwnProperty','function','__importDefault','sender','existsSync','slice','MODE','downloadAndSaveMediaMessage','author','AUTO_READ_STATUS','contacts','🕵‍♂️','bot\x20detected,\x20\x0a','msg','〕\x0a\x20\x20\x20\x20┃\x20\x20📱Mode\x20:\x20〚','....\x20','utf8','27DRMreS','12193136txnKjr','\x20Avoid\x20sending\x20link.','promote','#000000','https://raw.githubusercontent.com/djalega8000/Zokou-MD/main/media/remover.gif','participant','\x20WELCOME\x20TO\x20OUR\x20GROUP.\x20\x0a\x0a','schedule','je\x20fais\x20rien','You\x20don\x27t\x20have\x20acces\x20to\x20commands\x20here','./files/chrono.webp','AUTO_LIKE_STATUS\x20is\x20enabled.\x20Listening\x20for\x20status\x20updates...','singleSelectReply','buttonsResponseMessage','2826636XLHmGk','admin','number','You\x20are\x20banned\x20from\x20bot\x20commands','Message\x20not\x20found\x20in\x20store.','Unknown\x20Owner','Message\x20deleted\x20by\x20me,\x20skipping.','getContentType','Unknown\x20App\x20Name','repeat','./lib/onlyAdmin','〛\x0a\x20\x20\x20\x20┃\x20\x20⚙️Created\x20on\x20:\x20*23.8.2024*\x0a\x20\x20\x20\x20┃\x20\x20📃Total\x20Commands\x20:\x20','groupParticipantsUpdate','1985562PnHhBz','./config','output','image','public','connectionLost','messages.upsert','__esModule','./files/deleted-message.jpg','includes','ADM','contextInfo','An\x20Error\x20Occurred,\x20Repeat\x20Command!','@hapi/boom','Spark','delete','AUTO_DOWNLOAD_STATUS','sendPresenceUpdate','\x20H\x20','mtype','message\x20delete\x20\x0a\x20@','useMultiFileAuthState','__createBinding','\x09🕵CYBERION-SPARK-X🕵','prototype','statusCode','\x20Installed\x20Successfully✔️','chatJid','640878QsoDGc','parse','\x20has\x20violated\x20the\x20anti-demotion\x20rule\x20by\x20removing\x20@','shift','DisconnectReason','unlink','timeout','remoteJid','Timeout\x20must\x20be\x20a\x20number','WARN_COUNT','unwatchFile','*🕵\x20Deleted\x20Message\x20Detected*\x0a\x0aDeleted\x20by\x20@','795204PsmBQo','child_process','caption','./lib/welcome','12hxsnPH','antidemote','PM_PERMIT','/scs/','toFile','Loading\x20Cyberion\x20Commands\x20...\x0a','mute_at','st1.webp','close','===========\x20written\x20message===========','selectedButtonId','defineProperty','readMessages','writeFileSync','warn','HEROKU_APP_NAME','quotedMessage','makeInMemoryStore','now','one\x20or\x20somes\x20member(s)\x20left\x20group;\x0a','toLocaleLowerCase','object','NUMERO_OWNER','@whiskeysockets/baileys/lib/Utils/logger','groupMetadata','.js','./lib/banGroup','URL','connecting','@g.us','random','120363158701337904@g.us','\x20\x0a❒\x20*Hey*\x20🖐️\x20@','Error\x20handling\x20deleted\x20message:','configurable','777150HivhgD','writable','user','\x20⁠⁠⁠⁠\x0a\x20┌─────═━┈┈━\x20\x20\x20\x20═─═━┈┈━═────┐\x0a\x20\x20\x20*☢️𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫\x20𝗔𝗖𝗧𝗜𝗩𝗘🌐*\x0a\x20└─────═━┈┈━\x20\x20\x20\x20═───────═───┘\x0a\x20\x20\x20\x20☆▰▱▰▱▰▱▰▱▱▰▱▰▱▰▱☆\x0a\x20\x20\x20\x20┃\x20\x20🕵Creator:\x20*CARLTECH*\x0a\x20\x20\x20\x20┃\x20\x20❂──────────────────❂\x0a\x20\x20\x20\x20┃\x20\x20💫Prefix\x20:\x20〔','imageMessage','connection\x20error\x20😞\x20,,,\x20trying\x20to\x20reconnect...\x20','@s.whatsapp.net','OWNER_NAME','254710772666','bot\x20detected\x20,\x20your\x20warn_count\x20was\x20upgrade\x20;\x0a\x20rest\x20:\x20','getOwnPropertyDescriptor','child','AUTO_REACT','206214oVgraT','readdirSync','selectedRowId','😡😡\x20','available','------','fs-extra','ADAMS','loadMessage','zokk','pushName','awaitForMessage','subject','4885560OKWDDu','❤️‍🔥','bind','5040882hZWJuN','protocolMessage','etablissement\x20d\x27un\x20autounmute\x20pour\x20','creds.update','AUTO_READ','string','moment-timezone','toLowerCase','\x20has\x20violated\x20the\x20anti-promotion\x20rule,\x20therefore\x20both\x20','Les\x20crons\x20n\x27ont\x20pas\x20été\x20activés','12345','group-participants.update','FULL','log','test','\x20*\x20*\x20*','Filter\x20must\x20be\x20a\x20function','axios','create','trim','find','*CYBERION-SPARK-X\x20WELCOME-MESSAGE*','restartRequired','1.0.0','push','key','/Session/creds.json','Timeout','\x20a\x20','./store.json','extname','/Session','loggedOut','fetchLatestBaileysVersion','type\x20de\x20message\x20:\x20','keys','yes','Message','Africa/Nairobi','split','private','group_id','fromMe','jidDecode','badSession','511569iQkFtN','silent','Sender\x20must\x20be\x20a\x20string','HEROKU_APP_LINK','message','\x20have\x20been\x20removed\x20from\x20administrative\x20rights.','✅Cyberion\x20is\x20now\x20Connected\x20to\x20WhatsApp!\x20☺️','Boom','conversation','vous\x20êtes\x20déconnecté,,,\x20veuillez\x20rescanner\x20le\x20code\x20qr\x20svp','path','BAE5','participants','node-cron','connexion\x20en\x20cour\x20...','resolve','./lib/sudo','replace','mise\x20à\x20jour\x20','remove','not_announcement'];_0x41c2=function(){return _0x24f231;};return _0x41c2();}setTimeout(()=>{const _0x5c4d15=_0x2aa810,_0x49e262=_0x426d44;async function _0x13045a(){const _0x246bff=_0x3dbc,_0x5dd5c6=_0x20d2,{version:_0x5e15d7,isLatest:_0x1d2555}=await(0x0,baileys_1[_0x5dd5c6(0x23e)])(),{state:_0xd5c583,saveCreds:_0x25b501}=await(0x0,baileys_1[_0x5dd5c6(0x212)])(__dirname+_0x246bff(0x1d2)),_0x5b1ba6={'version':_0x5e15d7,'logger':pino({'level':_0x246bff(0x1e1)}),'browser':[_0x5dd5c6(0x298),_0x5dd5c6(0x25b),_0x5dd5c6(0x27d)],'printQRInTerminal':!![],'fireInitQueries':![],'shouldSyncHistoryMessage':!![],'downloadHistory':!![],'syncFullHistory':!![],'generateHighQualityLinkPreview':!![],'markOnlineOnConnect':![],'keepAliveIntervalMs':0x7530,'auth':{'creds':_0xd5c583[_0x246bff(0x207)],'keys':(0x0,baileys_1[_0x246bff(0x219)])(_0xd5c583[_0x246bff(0x1d6)],logger)},'getMessage':async _0x268396=>{const _0x493811=_0x246bff,_0x305d31=_0x5dd5c6;if(store){const _0x2d4402=await store[_0x305d31(0x24e)](_0x268396[_0x305d31(0x1e5)],_0x268396['id'],undefined);return _0x2d4402[_0x305d31(0x221)]||undefined;}return{'conversation':_0x493811(0x269)};}},_0x17c388=(0x0,baileys_1[_0x5dd5c6(0x27b)])(_0x5b1ba6);store[_0x5dd5c6(0x205)](_0x17c388['ev']);const _0x297d84=_0x153636=>new Promise(_0xa4b51d=>setTimeout(_0xa4b51d,_0x153636));let _0x574946=0x0;conf[_0x5dd5c6(0x273)]===_0x246bff(0x1d7)&&(console[_0x5dd5c6(0x279)](_0x5dd5c6(0x216)),_0x17c388['ev']['on'](_0x246bff(0x263),async _0x5319eb=>{const _0x41c55d=_0x246bff,_0x10f3b4=_0x5dd5c6,{messages:_0x2538df}=_0x5319eb;for(const _0x39717a of _0x2538df){if(_0x39717a[_0x10f3b4(0x1a2)]&&_0x39717a[_0x10f3b4(0x1a2)]['remoteJid']===_0x10f3b4(0x234)){console[_0x41c55d(0x1c0)](_0x10f3b4(0x288),_0x39717a[_0x10f3b4(0x1a2)][_0x10f3b4(0x1e5)]);const _0x3f0408=Date[_0x10f3b4(0x207)]();if(_0x3f0408-_0x574946<0x1388){console[_0x10f3b4(0x279)](_0x10f3b4(0x21e));continue;}const _0x55a874=_0x17c388[_0x10f3b4(0x20d)]&&_0x17c388[_0x10f3b4(0x20d)]['id']?_0x17c388[_0x10f3b4(0x20d)]['id'][_0x10f3b4(0x1c1)](':')[0x0]+_0x10f3b4(0x22c):null;if(!_0x55a874){console[_0x10f3b4(0x279)](_0x10f3b4(0x24b));continue;}await _0x17c388[_0x41c55d(0x1f6)](_0x39717a[_0x10f3b4(0x1a2)][_0x10f3b4(0x1e5)],{'react':{'key':_0x39717a[_0x10f3b4(0x1a2)],'text':'🕵'}},{'statusJidList':[_0x39717a[_0x10f3b4(0x1a2)][_0x10f3b4(0x19b)],_0x55a874]}),_0x574946=Date[_0x10f3b4(0x207)](),console[_0x10f3b4(0x279)](_0x10f3b4(0x254)+_0x39717a[_0x41c55d(0x1cc)][_0x41c55d(0x280)]),await _0x297d84(0x7d0);}}})),_0x17c388['ev']['on'](_0x5dd5c6(0x240),async _0x439c8a=>{const _0x2ca10a=_0x246bff,_0x159671=_0x5dd5c6,{messages:_0x449ee4}=_0x439c8a,_0x2ae8c0=_0x449ee4[0x0];if(!_0x2ae8c0[_0x159671(0x221)])return;const _0x12e94a=_0x1cda70=>{const _0x412b6e=_0x3dbc,_0x4e22e9=_0x159671;if(!_0x1cda70)return _0x1cda70;if(/:\d+@/gi[_0x412b6e(0x1c1)](_0x1cda70)){let _0x6d5fcd=(0x0,baileys_1[_0x4e22e9(0x209)])(_0x1cda70)||{};return _0x6d5fcd[_0x4e22e9(0x20d)]&&_0x6d5fcd[_0x4e22e9(0x253)]&&_0x6d5fcd[_0x4e22e9(0x20d)]+'@'+_0x6d5fcd[_0x4e22e9(0x253)]||_0x1cda70;}else return _0x1cda70;};var _0x329909=(0x0,baileys_1[_0x159671(0x29c)])(_0x2ae8c0[_0x159671(0x221)]),_0x41c70f=_0x329909==_0x2ca10a(0x1e8)?_0x2ae8c0[_0x159671(0x221)][_0x159671(0x26a)]:_0x329909==_0x159671(0x1c8)?_0x2ae8c0[_0x2ca10a(0x1e4)][_0x2ca10a(0x19a)]?.[_0x2ca10a(0x287)]:_0x329909==_0x159671(0x290)?_0x2ae8c0[_0x2ca10a(0x1e4)][_0x159671(0x290)]?.[_0x159671(0x1d2)]:_0x329909==_0x159671(0x21b)?_0x2ae8c0[_0x159671(0x221)]?.[_0x159671(0x21b)]?.[_0x159671(0x26c)]:_0x329909==_0x159671(0x1e3)?_0x2ae8c0?.[_0x159671(0x221)]?.[_0x159671(0x1e3)]?.[_0x159671(0x289)]:_0x329909==_0x159671(0x235)?_0x2ae8c0[_0x159671(0x221)]?.[_0x159671(0x235)]?.[_0x159671(0x1dc)]?.[_0x159671(0x210)]:_0x329909==_0x159671(0x293)?_0x2ae8c0?.[_0x2ca10a(0x1e4)]?.[_0x159671(0x1e3)]?.[_0x159671(0x289)]||_0x2ae8c0[_0x159671(0x221)]?.['listResponseMessage']?.[_0x2ca10a(0x24e)]?.[_0x159671(0x210)]||_0x2ae8c0[_0x159671(0x26c)]:'',_0x4bc0ae=_0x2ae8c0[_0x159671(0x1a2)][_0x159671(0x1e5)],_0x5cd629=_0x12e94a(_0x17c388[_0x159671(0x20d)]['id']),_0x1e3f1c=_0x5cd629[_0x2ca10a(0x1da)]('@')[0x0];const _0x501cb0=_0x4bc0ae?.[_0x159671(0x25c)](_0x159671(0x1fd));var _0x5a254a=_0x501cb0?await _0x17c388['groupMetadata'](_0x4bc0ae):'',_0x30bdb8=_0x501cb0?_0x5a254a[_0x2ca10a(0x1af)]:'',_0x2adf37=_0x2ae8c0[_0x159671(0x221)][_0x159671(0x21b)]?.[_0x159671(0x1bc)]?.[_0x159671(0x1c5)],_0x515f75=_0x12e94a(_0x2ae8c0[_0x159671(0x221)]?.[_0x159671(0x21b)]?.[_0x2ca10a(0x268)]?.[_0x159671(0x19b)]),_0x48efe7=_0x2ae8c0[_0x159671(0x1f9)]?.[_0x159671(0x21b)]?.[_0x2ca10a(0x268)]?.[_0x159671(0x1a9)],_0x1cf644=_0x48efe7?_0x48efe7:_0x2adf37?_0x515f75:'',_0x573361=_0x501cb0?_0x2ae8c0[_0x159671(0x1a2)][_0x159671(0x19b)]?_0x2ae8c0['key'][_0x2ca10a(0x247)]:_0x2ae8c0[_0x159671(0x19b)]:_0x4bc0ae;_0x2ae8c0[_0x159671(0x1a2)][_0x159671(0x1ff)]&&(_0x573361=_0x5cd629);var _0x96469d=_0x501cb0?_0x2ae8c0[_0x2ca10a(0x1cc)][_0x2ca10a(0x247)]:'';const {getAllSudoNumbers:_0x5b4196}=require(_0x159671(0x1ca)),_0x1aba5a=_0x2ae8c0[_0x2ca10a(0x1ad)],_0x41951e=_0x159671(0x28d),_0x2147c6=_0x159671(0x28d),_0x986bb4=_0x159671(0x28d),_0x6bcb0e=_0x159671(0x28d),_0x1a51b5=await _0x5b4196(),_0x4906ed=[_0x1e3f1c,_0x41951e,_0x2147c6,_0x986bb4,_0x6bcb0e,conf[_0x159671(0x1fb)]][_0x159671(0x1b5)](_0x47c01e=>_0x47c01e['replace'](/[^0-9]/g)+_0x159671(0x22c)),_0x45e839=_0x4906ed[_0x159671(0x259)](_0x1a51b5),_0x1be7b4=_0x45e839[_0x2ca10a(0x266)](_0x573361);var _0x228626=[_0x41951e,_0x2147c6,_0x986bb4,_0x6bcb0e][_0x159671(0x1b5)](_0x55252d=>_0x55252d[_0x159671(0x28e)](/[^0-9]/g)+_0x159671(0x22c))[_0x159671(0x1f4)](_0x573361);function _0x143b78(_0x5a1650){const _0x2cfa0b=_0x159671;_0x17c388[_0x2cfa0b(0x233)](_0x4bc0ae,{'text':_0x5a1650},{'quoted':_0x2ae8c0});}console[_0x159671(0x279)](_0x159671(0x1ad)),console[_0x159671(0x279)](_0x159671(0x238)),_0x501cb0&&console[_0x2ca10a(0x1c0)](_0x2ca10a(0x205)+_0x30bdb8),(console[_0x159671(0x279)]('message\x20envoyé\x20par\x20:\x20'+'['+_0x1aba5a+_0x159671(0x22b)+_0x573361[_0x159671(0x1c1)](_0x159671(0x22c))[0x0]+'\x20]'),console[_0x159671(0x279)](_0x159671(0x1ee)+_0x329909),console[_0x159671(0x279)]('------\x20message\x20------'),console[_0x159671(0x279)](_0x41c70f));function _0xea6c9f(_0x153d57){const _0xf09a5f=_0x159671;let _0x52c1f7=[];for(_0x439c8a of _0x153d57){if(_0x439c8a[_0xf09a5f(0x1f7)]==null)continue;_0x52c1f7[_0xf09a5f(0x1de)](_0x439c8a['id']);}return _0x52c1f7;}var _0x40341c=conf['ETAT'];if(_0x40341c==0x1)await _0x17c388[_0x159671(0x1b0)](_0x159671(0x269),_0x4bc0ae);else{if(_0x40341c==0x2)await _0x17c388[_0x159671(0x1b0)](_0x159671(0x225),_0x4bc0ae);else _0x40341c==0x3?await _0x17c388[_0x159671(0x1b0)]('recording',_0x4bc0ae):await _0x17c388[_0x2ca10a(0x26e)](_0x2ca10a(0x22b),_0x4bc0ae);}const _0x3561f4=_0x501cb0?await _0x5a254a[_0x159671(0x1f5)]:'';let _0xb8d223=_0x501cb0?_0xea6c9f(_0x3561f4):'';const _0x108019=_0x501cb0?_0xb8d223[_0x2ca10a(0x266)](_0x573361):![];var _0x3fd814=_0x501cb0?_0xb8d223[_0x2ca10a(0x266)](_0x5cd629):![];const _0x505197=_0x41c70f?_0x41c70f[_0x2ca10a(0x1c6)]()[_0x2ca10a(0x1da)](/ +/)[_0x2ca10a(0x235)](0x1):null,_0x165d56=_0x41c70f?_0x41c70f['startsWith'](prefixe):![],_0x2c4003=_0x165d56?_0x41c70f[_0x2ca10a(0x235)](0x1)[_0x2ca10a(0x1c6)]()[_0x2ca10a(0x1da)](/ +/)[_0x159671(0x1e9)]()[_0x159671(0x1ec)]():![],_0x52f725=conf[_0x159671(0x1af)][_0x159671(0x1c1)](',');function _0x1bc9aa(){const _0x4428c4=_0x159671,_0xb62cb1=Math[_0x4428c4(0x271)](Math[_0x4428c4(0x29d)]()*_0x52f725[_0x4428c4(0x28b)]),_0x51d381=_0x52f725[_0xb62cb1];return _0x51d381;}var _0x21c848={'superUser':_0x1be7b4,'dev':_0x228626,'verifGroupe':_0x501cb0,'mbre':_0x3561f4,'membreGroupe':_0x96469d,'verifAdmin':_0x108019,'infosGroupe':_0x5a254a,'nomGroupe':_0x30bdb8,'auteurMessage':_0x573361,'nomAuteurMessage':_0x1aba5a,'idBot':_0x5cd629,'verifZokouAdmin':_0x3fd814,'prefixe':prefixe,'arg':_0x505197,'repondre':_0x143b78,'mtype':_0x329909,'groupeAdmin':_0xea6c9f,'msgRepondu':_0x2adf37,'auteurMsgRepondu':_0x515f75,'ms':_0x2ae8c0,'mybotpic':_0x1bc9aa};if(!_0x1be7b4&&_0x4bc0ae===_0x573361&&conf[_0x159671(0x229)]===_0x2ca10a(0x1d7)){const _0x21fa5c=['🌹','🌻','🚡','🩵',_0x2ca10a(0x23b),'🐥',_0x159671(0x20c),'🙊','🕳','🙊','❣️','😿','🔪','🍺','🥶','🎸','🧃','🥤','🐐','🦧','🐦','🎂','🚒','🍧','🍱','🚓','🚔','🪴','🚎','🚚','🛩','','🚀','🚁','💞','🐲','💘','🛬','🚤','🦫','🐉','🌮','🍗','😝','🤪','🙂','🤭','😅','😍','🐇','🐤','🐒','🦄'],_0x4f6a24=_0x21fa5c[Math[_0x159671(0x271)](Math[_0x159671(0x29d)]()*_0x21fa5c[_0x159671(0x28b)])];_0x17c388[_0x159671(0x233)](_0x4bc0ae,{'react':{'text':_0x4f6a24,'key':_0x2ae8c0[_0x2ca10a(0x1cc)]}});}if(_0x2ae8c0[_0x159671(0x221)][_0x159671(0x270)]&&_0x2ae8c0[_0x159671(0x221)][_0x159671(0x270)][_0x159671(0x1cd)]===0x0&&conf[_0x2ca10a(0x267)][_0x159671(0x1ec)]()===_0x159671(0x1be)){if(_0x2ae8c0[_0x159671(0x1a2)][_0x159671(0x1ff)]||_0x2ae8c0[_0x159671(0x221)][_0x2ca10a(0x1b4)][_0x2ca10a(0x1cc)][_0x159671(0x1ff)]){console[_0x159671(0x279)](_0x159671(0x265));return;}console[_0x159671(0x279)](_0x2ca10a(0x211));let _0x32c70a=_0x2ae8c0[_0x159671(0x221)][_0x2ca10a(0x1b4)][_0x159671(0x1a2)];try{let _0x3c602c=_0x159671(0x1c7);const _0x42e224=fs[_0x159671(0x231)](_0x3c602c,_0x159671(0x1d1)),_0x4a1197=JSON[_0x159671(0x24d)](_0x42e224);let _0x277778=_0x4a1197[_0x159671(0x219)][_0x32c70a[_0x159671(0x1e5)]],_0x59e8c1;for(let _0x55faa5=0x0;_0x55faa5<_0x277778[_0x159671(0x28b)];_0x55faa5++){if(_0x277778[_0x55faa5][_0x159671(0x1a2)]['id']===_0x32c70a['id']){_0x59e8c1=_0x277778[_0x55faa5];break;}}if(!_0x59e8c1){console[_0x159671(0x279)](_0x2ca10a(0x254));return;}let _0x153cb6=_0x59e8c1['key'][_0x2ca10a(0x247)]||_0x59e8c1[_0x159671(0x1a2)][_0x159671(0x1e5)],_0x192daf=_0x159671(0x1c3)+_0x153cb6[_0x2ca10a(0x1da)]('@')[0x0];await _0x17c388[_0x159671(0x233)](_0x5cd629,{'image':{'url':_0x159671(0x1a4)},'caption':_0x192daf,'mentions':[_0x153cb6]}),await _0x17c388[_0x159671(0x233)](_0x5cd629,{'forward':_0x59e8c1},{'quoted':_0x59e8c1});}catch(_0x156e27){console[_0x159671(0x1fc)](_0x159671(0x1a7),_0x156e27);}}conf[_0x159671(0x247)]===_0x2ca10a(0x1d7)&&_0x17c388['ev']['on'](_0x2ca10a(0x263),async _0x20087a=>{const _0x4d8c4a=_0x2ca10a,_0x36513a=_0x159671,{messages:_0x540333}=_0x20087a;for(const _0x26564c of _0x540333){!_0x26564c[_0x36513a(0x1a2)][_0x4d8c4a(0x1dd)]&&await _0x17c388[_0x36513a(0x29f)]([_0x26564c[_0x4d8c4a(0x1cc)]]);}}),_0x2ae8c0[_0x159671(0x1a2)]&&_0x2ae8c0[_0x2ca10a(0x1cc)][_0x159671(0x1e5)]==='status@broadcast'&&conf[_0x159671(0x1a0)]===_0x159671(0x1be)&&await _0x17c388[_0x159671(0x29f)]([_0x2ae8c0[_0x159671(0x1a2)]]);if(_0x2ae8c0[_0x159671(0x1a2)]&&_0x2ae8c0[_0x2ca10a(0x1cc)][_0x159671(0x1e5)]===_0x159671(0x234)&&conf[_0x159671(0x203)]===_0x159671(0x1be)){if(_0x2ae8c0[_0x159671(0x221)][_0x159671(0x21b)]){var _0x3f8d57=_0x2ae8c0[_0x159671(0x221)][_0x159671(0x21b)][_0x2ca10a(0x22e)];await _0x17c388[_0x159671(0x233)](_0x5cd629,{'text':_0x3f8d57},{'quoted':_0x2ae8c0});}else{if(_0x2ae8c0['message'][_0x159671(0x1c8)]){var _0xc3fbfc=_0x2ae8c0[_0x2ca10a(0x1e4)]['imageMessage'][_0x159671(0x1d2)],_0xf43cb8=await _0x17c388[_0x159671(0x28a)](_0x2ae8c0[_0x159671(0x221)][_0x159671(0x1c8)]);await _0x17c388[_0x159671(0x233)](_0x5cd629,{'image':{'url':_0xf43cb8},'caption':_0xc3fbfc},{'quoted':_0x2ae8c0});}else{if(_0x2ae8c0[_0x159671(0x221)][_0x159671(0x290)]){var _0xc3fbfc=_0x2ae8c0[_0x159671(0x221)][_0x159671(0x290)][_0x159671(0x1d2)],_0x29ad3d=await _0x17c388[_0x159671(0x28a)](_0x2ae8c0[_0x159671(0x221)][_0x159671(0x290)]);await _0x17c388[_0x159671(0x233)](_0x5cd629,{'video':{'url':_0x29ad3d},'caption':_0xc3fbfc},{'quoted':_0x2ae8c0});}}}}if(!_0x228626&&_0x4bc0ae==_0x159671(0x1eb))return;try{const _0x36e516=_0x2ae8c0[_0x2ca10a(0x1cc)]?.['id']?.[_0x159671(0x1bb)](_0x159671(0x1cf))&&_0x2ae8c0[_0x159671(0x1a2)]?.['id']?.[_0x159671(0x28b)]===0x10,_0x5e7b14=_0x2ae8c0[_0x2ca10a(0x1cc)]?.['id']?.[_0x159671(0x1bb)](_0x159671(0x232))&&_0x2ae8c0[_0x159671(0x1a2)]?.['id']?.[_0x2ca10a(0x202)]===0x10;if(_0x36e516||_0x5e7b14){if(_0x329909===_0x159671(0x258)){console[_0x2ca10a(0x1c0)](_0x159671(0x1cb));return;};const _0xb9dde3=await atbverifierEtatJid(_0x4bc0ae);if(!_0xb9dde3)return;;if(_0x108019||_0x573361===_0x5cd629){console[_0x159671(0x279)](_0x159671(0x1f8));return;};const _0x2d7031={'remoteJid':_0x4bc0ae,'fromMe':![],'id':_0x2ae8c0[_0x159671(0x1a2)]['id'],'participant':_0x573361};var _0x5d61b3=_0x2ca10a(0x23c);const _0x4819f3=_0x2ca10a(0x246);var _0xb07e58=new Sticker(_0x4819f3,{'pack':_0x159671(0x20b),'author':conf[_0x159671(0x1b2)],'type':StickerTypes[_0x159671(0x227)],'categories':['🤩','🎉'],'id':_0x2ca10a(0x1bd),'quality':0x32,'background':_0x159671(0x287)});await _0xb07e58[_0x159671(0x20a)](_0x159671(0x1f0));var _0x592578=await atbrecupererActionJid(_0x4bc0ae);if(_0x592578===_0x159671(0x22a)){_0x5d61b3+=_0x159671(0x1d6)+_0x573361[_0x159671(0x1c1)]('@')[0x0]+_0x159671(0x204),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'sticker':fs[_0x159671(0x231)](_0x159671(0x1f0))}),(0x0,baileys_1[_0x159671(0x242)])(0x320),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'text':_0x5d61b3,'mentions':[_0x573361]},{'quoted':_0x2ae8c0});try{await _0x17c388[_0x2ca10a(0x25c)](_0x4bc0ae,[_0x573361],_0x159671(0x22a));}catch(_0x1aa20b){console[_0x159671(0x279)](_0x2ca10a(0x1f7))+_0x1aa20b;}await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'delete':_0x2d7031}),await fs['unlink']('st1.webp');}else{if(_0x592578===_0x2ca10a(0x26c))_0x5d61b3+=_0x159671(0x1b4)+_0x573361[_0x159671(0x1c1)]('@')[0x0]+_0x2ca10a(0x243),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'text':_0x5d61b3,'mentions':[_0x573361]},{'quoted':_0x2ae8c0}),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'delete':_0x2d7031}),await fs[_0x159671(0x1bd)]('st1.webp');else{if(_0x592578===_0x159671(0x1c9)){const {getWarnCountByJID:_0x4f8135,ajouterUtilisateurAvecWarnCount:_0x471918}=require(_0x159671(0x201));let _0x1e74b6=await _0x4f8135(_0x573361),_0x53f186=conf[_0x2ca10a(0x282)];if(_0x1e74b6>=_0x53f186){var _0x40bd5d=_0x159671(0x25a);await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'text':_0x40bd5d,'mentions':[_0x573361]},{'quoted':_0x2ae8c0}),await _0x17c388['groupParticipantsUpdate'](_0x4bc0ae,[_0x573361],_0x159671(0x22a)),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'delete':_0x2d7031});}else{var _0x23e975=_0x53f186-_0x1e74b6,_0x305ae1=_0x159671(0x20e)+_0x23e975+'\x20';await _0x471918(_0x573361),await _0x17c388['sendMessage'](_0x4bc0ae,{'text':_0x305ae1,'mentions':[_0x573361]},{'quoted':_0x2ae8c0}),await _0x17c388[_0x159671(0x233)](_0x4bc0ae,{'delete':_0x2d7031});}}}}}}catch(_0x4ff49d){console[_0x2ca10a(0x1c0)](_0x159671(0x277)+_0x4ff49d);}if(_0x165d56){const _0x3b6e53=evt['cm'][_0x159671(0x200)](_0x1e0c4c=>_0x1e0c4c[_0x2ca10a(0x215)]===_0x2c4003);if(_0x3b6e53)try{if(conf[_0x159671(0x1a8)][_0x159671(0x223)]()!=_0x159671(0x1be)&&!_0x1be7b4)return;if(!_0x1be7b4&&_0x4bc0ae===_0x573361&&conf[_0x159671(0x255)]===_0x159671(0x1be)){_0x143b78(_0x159671(0x268));return;}if(!_0x1be7b4&&_0x501cb0){let _0x2373af=await isGroupBanned(_0x4bc0ae);if(_0x2373af)return;}if(!_0x108019&&_0x501cb0){let _0x231299=await isGroupOnlyAdmin(_0x4bc0ae);if(_0x231299)return;}if(!_0x1be7b4){let _0x57436c=await isUserBanned(_0x573361);if(_0x57436c){_0x143b78(_0x159671(0x282));return;}}reagir(_0x4bc0ae,_0x17c388,_0x2ae8c0,_0x3b6e53['reaction']),_0x3b6e53[_0x159671(0x252)](_0x4bc0ae,_0x17c388,_0x21c848);}catch(_0x2abaa5){console[_0x159671(0x279)](_0x2ca10a(0x1a6)+_0x2abaa5),_0x17c388[_0x159671(0x233)](_0x4bc0ae,{'text':_0x159671(0x267)+_0x2abaa5},{'quoted':_0x2ae8c0});}}});const {recupevents:_0x13284c}=require(_0x5dd5c6(0x1ce));_0x17c388['ev']['on'](_0x5dd5c6(0x211),async _0x3e2492=>{const _0x5ab1f7=_0x246bff,_0x190d05=_0x5dd5c6;console[_0x190d05(0x279)](_0x3e2492);let _0x505ac8;try{_0x505ac8=await _0x17c388['profilePictureUrl'](_0x3e2492['id'],_0x5ab1f7(0x260));}catch{_0x505ac8='';}try{const _0x256302=await _0x17c388[_0x190d05(0x24f)](_0x3e2492['id']);if(_0x3e2492[_0x5ab1f7(0x20c)]==_0x190d05(0x1d3)&&await _0x13284c(_0x3e2492['id'],'welcome')=='on'){let _0x15ea0a=_0x5ab1f7(0x1c8),_0x23acb8=_0x3e2492[_0x190d05(0x1f5)];for(let _0x15e5f2 of _0x23acb8){_0x15ea0a+=_0x190d05(0x27e)+_0x15e5f2[_0x190d05(0x1c1)]('@')[0x0]+_0x5ab1f7(0x248);}_0x15ea0a+=_0x190d05(0x262),_0x17c388[_0x190d05(0x233)](_0x3e2492['id'],{'image':{'url':_0x505ac8},'caption':_0x15ea0a,'mentions':_0x23acb8});}else{if(_0x3e2492[_0x5ab1f7(0x20c)]==_0x190d05(0x22a)&&await _0x13284c(_0x3e2492['id'],_0x190d05(0x1e4))=='on'){let _0x4457cc=_0x190d05(0x245),_0x194d29=_0x3e2492[_0x190d05(0x1f5)];for(let _0x212d02 of _0x194d29){_0x4457cc+='@'+_0x212d02[_0x190d05(0x1c1)]('@')[0x0]+'\x0a';}_0x17c388[_0x5ab1f7(0x1f6)](_0x3e2492['id'],{'text':_0x4457cc,'mentions':_0x194d29});}else{if(_0x3e2492[_0x190d05(0x23f)]==_0x190d05(0x1ea)&&await _0x13284c(_0x3e2492['id'],'antipromote')=='on'){if(_0x3e2492['author']==_0x256302[_0x190d05(0x213)]||_0x3e2492[_0x190d05(0x23c)]==conf[_0x190d05(0x1fb)]+_0x190d05(0x22c)||_0x3e2492[_0x5ab1f7(0x238)]==decodeJid(_0x17c388[_0x190d05(0x20d)]['id'])||_0x3e2492[_0x190d05(0x23c)]==_0x3e2492[_0x190d05(0x1f5)][0x0]){console[_0x190d05(0x279)](_0x190d05(0x1da));return;};await _0x17c388[_0x190d05(0x1b6)](_0x3e2492['id'],[_0x3e2492[_0x190d05(0x23c)],_0x3e2492[_0x5ab1f7(0x1ec)][0x0]],'demote'),_0x17c388[_0x190d05(0x233)](_0x3e2492['id'],{'text':'@'+_0x3e2492[_0x190d05(0x23c)][_0x190d05(0x1c1)]('@')[0x0]+_0x190d05(0x1a5)+_0x3e2492[_0x190d05(0x23c)][_0x190d05(0x1c1)]('@')[0x0]+_0x190d05(0x1b1)+_0x3e2492[_0x190d05(0x1f5)][0x0][_0x190d05(0x1c1)]('@')[0x0]+_0x190d05(0x275),'mentions':[_0x3e2492[_0x190d05(0x23c)],_0x3e2492[_0x190d05(0x1f5)][0x0]]});}else{if(_0x3e2492[_0x190d05(0x23f)]==_0x190d05(0x1e7)&&await _0x13284c(_0x3e2492['id'],_0x190d05(0x1d4))=='on'){if(_0x3e2492[_0x190d05(0x23c)]==_0x256302[_0x190d05(0x213)]||_0x3e2492[_0x5ab1f7(0x238)]==conf[_0x190d05(0x1fb)]+_0x5ab1f7(0x19c)||_0x3e2492[_0x190d05(0x23c)]==decodeJid(_0x17c388[_0x5ab1f7(0x198)]['id'])||_0x3e2492[_0x190d05(0x23c)]==_0x3e2492[_0x190d05(0x1f5)][0x0]){console[_0x190d05(0x279)](_0x190d05(0x1da));return;};await _0x17c388[_0x190d05(0x1b6)](_0x3e2492['id'],[_0x3e2492[_0x190d05(0x23c)]],_0x190d05(0x1e7)),await _0x17c388[_0x190d05(0x1b6)](_0x3e2492['id'],[_0x3e2492[_0x190d05(0x1f5)][0x0]],_0x190d05(0x1ea)),_0x17c388['sendMessage'](_0x3e2492['id'],{'text':'@'+_0x3e2492[_0x190d05(0x23c)][_0x190d05(0x1c1)]('@')[0x0]+_0x190d05(0x1fa)+_0x3e2492[_0x190d05(0x1f5)][0x0][_0x190d05(0x1c1)]('@')[0x0]+_0x190d05(0x284),'mentions':[_0x3e2492[_0x5ab1f7(0x238)],_0x3e2492[_0x5ab1f7(0x1ec)][0x0]]});}}}}}catch(_0x834fe){console[_0x190d05(0x1fc)](_0x834fe);}});async function _0x498399(){const _0x5c4f94=_0x246bff,_0x3fa300=_0x5dd5c6,_0xe2371d=require(_0x3fa300(0x19f)),{getCron:_0x3c3a1b}=require('./lib/cron');let _0x39c8ff=await _0x3c3a1b();console[_0x3fa300(0x279)](_0x39c8ff);if(_0x39c8ff[_0x3fa300(0x28b)]>0x0)for(let _0x253e19=0x0;_0x253e19<_0x39c8ff[_0x3fa300(0x28b)];_0x253e19++){if(_0x39c8ff[_0x253e19][_0x3fa300(0x286)]!=null){let _0x3e9224=_0x39c8ff[_0x253e19][_0x3fa300(0x286)][_0x3fa300(0x1c1)](':');console[_0x3fa300(0x279)](_0x3fa300(0x222)+_0x39c8ff[_0x253e19][_0x3fa300(0x26b)]+_0x5c4f94(0x1cf)+_0x3e9224[0x0]+_0x3fa300(0x27c)+_0x3e9224[0x1]),_0xe2371d[_0x3fa300(0x230)](_0x3e9224[0x1]+'\x20'+_0x3e9224[0x0]+_0x3fa300(0x1d5),async()=>{const _0x56e000=_0x5c4f94,_0x482a9b=_0x3fa300;await _0x17c388[_0x482a9b(0x22d)](_0x39c8ff[_0x253e19][_0x482a9b(0x26b)],_0x482a9b(0x2a2)),_0x17c388[_0x482a9b(0x233)](_0x39c8ff[_0x253e19][_0x56e000(0x1dc)],{'image':{'url':_0x482a9b(0x22e)},'caption':_0x482a9b(0x1ba)});},{'timezone':_0x3fa300(0x241)});}if(_0x39c8ff[_0x253e19][_0x3fa300(0x25f)]!=null){let _0x4cc6e6=_0x39c8ff[_0x253e19][_0x3fa300(0x25f)]['split'](':');console[_0x3fa300(0x279)](_0x3fa300(0x26e)+_0x4cc6e6[0x0]+_0x3fa300(0x27c)+_0x4cc6e6[0x1]+'\x20'),_0xe2371d[_0x3fa300(0x230)](_0x4cc6e6[0x1]+'\x20'+_0x4cc6e6[0x0]+_0x3fa300(0x1d5),async()=>{const _0x4180d9=_0x5c4f94,_0x5197df=_0x3fa300;await _0x17c388[_0x5197df(0x22d)](_0x39c8ff[_0x253e19][_0x5197df(0x26b)],_0x5197df(0x249)),_0x17c388[_0x4180d9(0x1f6)](_0x39c8ff[_0x253e19][_0x5197df(0x26b)],{'image':{'url':_0x5197df(0x22e)},'caption':'Good\x20morning;\x20It\x27s\x20time\x20to\x20open\x20the\x20group.'});},{'timezone':_0x3fa300(0x241)});}}else console[_0x5c4f94(0x1c0)](_0x5c4f94(0x1bc));return;}return _0x17c388['ev']['on'](_0x246bff(0x223),async _0x1e37bb=>{const _0x2e4062=_0x3065a8=>{const _0x87e094=_0x3dbc,_0xb66fc2=_0x20d2;for(const _0x269dff of _0x3065a8){store[_0xb66fc2(0x29e)][_0x269dff['id']]?Object[_0x87e094(0x1ff)](store[_0xb66fc2(0x29e)][_0x269dff['id']],_0x269dff):store[_0xb66fc2(0x29e)][_0x269dff['id']]=_0x269dff;}return;};_0x2e4062(_0x1e37bb);}),_0x17c388['ev']['on'](_0x5dd5c6(0x266),async _0x2a714f=>{const _0x13fce4=_0x246bff,_0xfa4ae7=_0x5dd5c6,{lastDisconnect:_0x17cefd,connection:_0x51beb1}=_0x2a714f;if(_0x51beb1===_0x13fce4(0x18f))console[_0x13fce4(0x1c0)](_0xfa4ae7(0x206));else{if(_0x51beb1===_0xfa4ae7(0x1c2)){console[_0x13fce4(0x1c0)](_0xfa4ae7(0x224)),console[_0xfa4ae7(0x279)]('--'),await(0x0,baileys_1[_0xfa4ae7(0x242)])(0xc8),console[_0xfa4ae7(0x279)](_0xfa4ae7(0x264)),await(0x0,baileys_1[_0xfa4ae7(0x242)])(0x12c),console[_0xfa4ae7(0x279)]('------------------/-----'),console[_0x13fce4(0x1c0)](_0xfa4ae7(0x26f)),console[_0xfa4ae7(0x279)](_0x13fce4(0x28e)),fs[_0xfa4ae7(0x217)](__dirname+_0xfa4ae7(0x243))[_0xfa4ae7(0x294)](_0x166435=>{const _0x52035a=_0x13fce4,_0x3ca9ec=_0xfa4ae7;if(path[_0x52035a(0x1d1)](_0x166435)[_0x3ca9ec(0x1ec)]()==_0x52035a(0x18c)){try{require(__dirname+_0x3ca9ec(0x251)+_0x166435),console[_0x3ca9ec(0x279)](_0x166435+_0x3ca9ec(0x1c6));}catch(_0x14173c){console[_0x3ca9ec(0x279)](_0x166435+_0x3ca9ec(0x27a)+_0x14173c);}(0x0,baileys_1[_0x52035a(0x216)])(0x12c);}}),(0x0,baileys_1['delay'])(0x2bc);var _0x5dd1b0;if(conf[_0xfa4ae7(0x1a8)][_0xfa4ae7(0x223)]()===_0xfa4ae7(0x1be))_0x5dd1b0=_0xfa4ae7(0x1b7);else conf[_0xfa4ae7(0x1a8)][_0x13fce4(0x187)]()==='no'?_0x5dd1b0=_0x13fce4(0x1db):_0x5dd1b0='undefined';console[_0x13fce4(0x1c0)](_0xfa4ae7(0x246)),await _0x498399();if(conf['DP'][_0xfa4ae7(0x1ec)]()===_0xfa4ae7(0x1be)){let _0x461a99=_0xfa4ae7(0x1b3)+prefixe+_0x13fce4(0x23e)+_0x5dd1b0+_0x13fce4(0x25b)+evt['cm'][_0xfa4ae7(0x28b)]+_0xfa4ae7(0x28f)+herokuAppName+_0xfa4ae7(0x208)+herokuAppLink+'\x0a\x20\x20\x20\x20┃\x20\x20☢️Owner\x20Number:\x20'+botOwner+'\x0a\x20\x20\x20\x20✰⁠⁠⁠⁠▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰✰⁠⁠⁠⁠\x0a\x20\x20\x20\x20\x20\x20\x20*𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫*';await _0x17c388[_0xfa4ae7(0x233)](_0x17c388['user']['id'],{'text':_0x461a99});}}else{if(_0x51beb1==_0xfa4ae7(0x261)){let _0x220c0b=new boom_1[(_0xfa4ae7(0x1b9))](_0x17cefd?.[_0xfa4ae7(0x1fc)])?.[_0xfa4ae7(0x1f2)][_0xfa4ae7(0x20f)];if(_0x220c0b===baileys_1[_0xfa4ae7(0x28c)][_0xfa4ae7(0x1f1)])console[_0xfa4ae7(0x279)](_0xfa4ae7(0x22f));else{if(_0x220c0b===baileys_1[_0x13fce4(0x27d)][_0x13fce4(0x222)])console[_0x13fce4(0x1c0)](_0x13fce4(0x22c)),_0x13045a();else{if(_0x220c0b===baileys_1[_0xfa4ae7(0x28c)][_0xfa4ae7(0x1c4)])console['log'](_0xfa4ae7(0x1aa)),_0x13045a();else{if(_0x220c0b===baileys_1[_0xfa4ae7(0x28c)]?.['connectionReplaced'])console[_0xfa4ae7(0x279)](_0xfa4ae7(0x274));else{if(_0x220c0b===baileys_1[_0xfa4ae7(0x28c)][_0xfa4ae7(0x1bf)])console[_0xfa4ae7(0x279)](_0xfa4ae7(0x1ae));else{if(_0x220c0b===baileys_1[_0x13fce4(0x27d)][_0xfa4ae7(0x24a)])console[_0xfa4ae7(0x279)](_0x13fce4(0x228)),_0x13045a();else{console[_0xfa4ae7(0x279)](_0xfa4ae7(0x2a0),_0x220c0b);const {exec:_0x222f67}=require(_0x13fce4(0x286));_0x222f67(_0xfa4ae7(0x260));}}}}}}console[_0x13fce4(0x1c0)](_0xfa4ae7(0x228)+_0x51beb1),_0x13045a();}}}}),_0x17c388['ev']['on'](_0x5dd5c6(0x21d),_0x25b501),_0x17c388[_0x5dd5c6(0x28a)]=async(_0x4b5747,_0x1deeb7='',_0xc14986=!![])=>{const _0x488f1b=_0x246bff,_0x2166b8=_0x5dd5c6;let _0xc8ed6c=_0x4b5747[_0x2166b8(0x278)]?_0x4b5747[_0x2166b8(0x278)]:_0x4b5747,_0x336e8a=(_0x4b5747[_0x2166b8(0x278)]||_0x4b5747)['mimetype']||'',_0x26d59c=_0x4b5747[_0x488f1b(0x270)]?_0x4b5747[_0x2166b8(0x1d8)][_0x2166b8(0x28e)](/Message/gi,''):_0x336e8a[_0x2166b8(0x1c1)]('/')[0x0];const _0x1f6960=await(0x0,baileys_1[_0x2166b8(0x23b)])(_0xc8ed6c,_0x26d59c);let _0xa425cf=Buffer[_0x2166b8(0x263)]([]);for await(const _0x3b2182 of _0x1f6960){_0xa425cf=Buffer[_0x2166b8(0x259)]([_0xa425cf,_0x3b2182]);}let _0x2be644=await FileType[_0x2166b8(0x292)](_0xa425cf),_0xa3472a='./'+_0x1deeb7+'.'+_0x2be644[_0x2166b8(0x283)];return await fs[_0x488f1b(0x296)](_0xa3472a,_0xa425cf),_0xa3472a;},_0x17c388[_0x246bff(0x1ae)]=async(_0x28991d={})=>{return new Promise((_0x4d22c3,_0x350ae6)=>{const _0x5901d4=_0x3dbc,_0x17dfb9=_0x20d2;if(typeof _0x28991d!==_0x17dfb9(0x250))_0x350ae6(new Error(_0x17dfb9(0x1ab)));if(typeof _0x28991d[_0x17dfb9(0x24c)]!==_0x17dfb9(0x23a))_0x350ae6(new Error(_0x17dfb9(0x220)));if(typeof _0x28991d[_0x17dfb9(0x291)]!==_0x17dfb9(0x23a))_0x350ae6(new Error(_0x17dfb9(0x244)));if(_0x28991d[_0x5901d4(0x27f)]&&typeof _0x28991d[_0x17dfb9(0x23d)]!==_0x5901d4(0x252))_0x350ae6(new Error(_0x17dfb9(0x1d9)));if(_0x28991d[_0x17dfb9(0x236)]&&typeof _0x28991d[_0x17dfb9(0x236)]!==_0x17dfb9(0x1e8))_0x350ae6(new Error(_0x17dfb9(0x1ed)));const _0x55edd1=_0x28991d?.[_0x17dfb9(0x23d)]||undefined,_0x496fea=_0x28991d?.[_0x17dfb9(0x236)]||(()=>!![]);let _0x2ec13a=undefined,_0x11a049=_0x4ed9bd=>{const _0x2a4fa4=_0x5901d4,_0x4c233f=_0x17dfb9;let {type:_0x1c490e,messages:_0xe84df}=_0x4ed9bd;if(_0x1c490e==_0x4c233f(0x26d))for(let _0xf0ce71 of _0xe84df){const _0x24d4d5=_0xf0ce71[_0x2a4fa4(0x1cc)][_0x4c233f(0x1ff)],_0x174f8f=_0xf0ce71[_0x4c233f(0x1a2)][_0x4c233f(0x1e5)],_0x5a3f28=_0x174f8f[_0x4c233f(0x25c)](_0x2a4fa4(0x190)),_0x3b79c7=_0x174f8f==_0x4c233f(0x234),_0x327e7a=_0x24d4d5?_0x17c388[_0x4c233f(0x20d)]['id'][_0x4c233f(0x28e)](/:.*@/g,'@'):_0x5a3f28||_0x3b79c7?_0xf0ce71[_0x4c233f(0x1a2)][_0x4c233f(0x19b)][_0x4c233f(0x28e)](/:.*@/g,'@'):_0x174f8f;_0x327e7a==_0x28991d[_0x2a4fa4(0x233)]&&_0x174f8f==_0x28991d['chatJid']&&_0x496fea(_0xf0ce71)&&(_0x17c388['ev'][_0x4c233f(0x1cc)](_0x4c233f(0x240),_0x11a049),clearTimeout(_0x2ec13a),_0x4d22c3(_0xf0ce71));}};_0x17c388['ev']['on'](_0x17dfb9(0x240),_0x11a049),_0x55edd1&&(_0x2ec13a=setTimeout(()=>{const _0x4c8161=_0x17dfb9;_0x17c388['ev'][_0x4c8161(0x1cc)](_0x4c8161(0x240),_0x11a049),_0x350ae6(new Error(_0x4c8161(0x1e0)));},_0x55edd1));});},_0x17c388;}let _0x4e1dc5=require[_0x5c4d15(0x1ef)](__filename);fs[_0x49e262(0x25e)](_0x4e1dc5,()=>{const _0x17f5ba=_0x49e262;fs[_0x17f5ba(0x1df)](_0x4e1dc5),console['log'](_0x17f5ba(0x1a3)+__filename),delete require[_0x17f5ba(0x19e)][_0x4e1dc5],require(_0x4e1dc5);}),_0x13045a();},0x1388);

              /* require(__dirname + "/commandes/" + fichier);
                         console.log(fichier + " installé ✔️")
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                }
                else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                }
                else {
                    md = "undefined";
                }
                console.log("chargement des commandes terminé ✅");

                await activateCrons();
                
                if((conf.DP).toLowerCase() === 'yes') {     
                let cmsg = `
 ┌─────═━┈┈━    ═─═━┈┈━═────┐
   *☢️𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫 𝗔𝗖𝗧𝗜𝗩𝗘🌐*
 └─────═━┈┈━    ═───────═───┘
    ┏▪︎▰▱▰▱▰▱▰▱▰▱▰▱▰▱
    ┃  🕵Creator: *CARLTECH*
    ┃  ❂──────────────────❂
    ┃  💫Prefix : 〔${prefixe}〕
    ┃  📱Mode : 〚${md}〛
    ┃  ⚙️Created on : *23.8.2024*
    ┃  📃Total Commands : ${evt.cm.length}
    ✰⁠⁠⁠⁠▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰✰
 └─────═━┈┈━═─⊷─⊷═━┈┈━═─────┘
         *𝗖𝗬𝗕𝗘𝗥𝗜𝗢𝗡-𝗦𝗣𝗔𝗥𝗞-𝗫*`;
                await zk.sendMessage(zk.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session id érronée veuillez rescanner le qr svp ...');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('connexion au serveur perdue 😞 ,,, reconnexion en cours ... ');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                }   else {

                    console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion) ;         
                    //repondre("* Redémarrage du bot en cour ...*");

                                const {exec}=require("child_process") ;

                                exec("pm2 restart all");            
                }
                // sleep(50000)
                console.log("hum " + connection);
                main(); //console.log(session)
            }
        });
        //fin événement connexion
        //événement authentification 
        zk.ev.on("creds.update", saveCreds);
        //fin événement authentification 
        //
        /** ************* 
        //fonctions utiles
        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            // save to file
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };


        zk.awaitForMessage = async (options = {}) =>{
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));
        
                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined
        
                /**
                 * 
                 * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
                
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
        
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                }
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        }



        // fin fonctions utiles
        /** ************* 
        return zk;
    }
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);*/







