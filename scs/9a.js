

const {
  adams
} = require("../Ibrahim/adams");
const s = require("../config");
const fs = require('fs');
function getDescriptionFromEnv(_0x2c48a6) {
  filePath = "./app.json";
  const _0x40c030 = fs.readFileSync(filePath, "utf-8");
  const _0x43f17c = JSON.parse(_0x40c030);
  const _0x4457fc = _0x43f17c.env[_0x2c48a6];
  return _0x4457fc && _0x4457fc.description ? _0x4457fc.description : "The environment variable description was not found.";
}
adams({
  'nomCom': "settings",
  'categorie': "HEROKU"
}, async (_0x390a0d, _0x474502, _0x1532ce) => {
  const {
    ms: _0x587c34,
    repondre: _0x477861,
    superUser: _0x749475,
    auteurMessage: _0x2ad5d0
  } = _0x1532ce;
  if (!_0x749475) {
    _0x477861("This command is for my owner only!");
    return;
  }
  ;
  let _0x1fe367 = [{
    'nom': "AUTO_REACTION",
    'choix': ['on', "off"]
  }, {
    'nom': "AUTO_VIEW_STATUS",
    'choix': ['on', "off"]
  }, {
    'nom': "AUTO_SAVE_STATUS",
    'choix': ['on', "off"]
  }, {
    'nom': "PM_PERMIT",
    'choix': ['on', "off"]
  }, {
    'nom': "BOT_MODE",
    'choix': ["public", "private"]
  }, {
    'nom': "STARTING_MESSAGE",
    'choix': ['on', "off"]
  }, {
    'nom': "AUTO_READ_MESSAGES",
    'choix': ['on', "off"]
  }, {
    'nom': "PRESENCE",
    'choix': ["online", "typing", "recording"]
  }, {
    'nom': "CHAT_BOT",
    'choix': ['on', "off"]
  }];
  let _0x234e09 = "*CYBERION VARS* \n\n";
  for (v = 0; v < _0x1fe367.length; v++) {
    _0x234e09 += v + 1 + "- *" + _0x1fe367[v].nom + "*\n";
  }
  _0x234e09 += "\n*Please Choose a variable by its number*";
  let _0x4f4bea = await _0x474502.sendMessage(_0x390a0d, {
    'text': _0x234e09
  }, {
    'quoted': _0x587c34
  });
  console.log(_0x4f4bea);
  let _0x270336 = await _0x474502.awaitForMessage({
    'chatJid': _0x390a0d,
    'sender': _0x2ad5d0,
    'timeout': 0xea60,
    'filter': _0x49a7f1 => _0x49a7f1.message.extendedTextMessage && _0x49a7f1.message.extendedTextMessage.contextInfo.stanzaId == _0x4f4bea.key.id && _0x49a7f1.message.extendedTextMessage.text > 0 && _0x49a7f1.message.extendedTextMessage.text <= _0x1fe367.length
  });
  let _0x5da69f = _0x270336.message.extendedTextMessage.text - 1;
  let {
    nom: _0x3a4d69,
    choix: _0x538bf7
  } = _0x1fe367[_0x5da69f];
  let _0x2fcac8 = "*CYBERION VARS*\n\n";
  _0x2fcac8 += "*Variable Name* :" + _0x3a4d69 + "\n";
  _0x2fcac8 += "*Description* :" + getDescriptionFromEnv(_0x3a4d69) + "\n\n";
  _0x2fcac8 += "Select one\n\n";
  for (i = 0; i < _0x538bf7.length; i++) {
    _0x2fcac8 += "* *" + (i + 1) + "* => " + _0x538bf7[i] + "\n";
  }
  _0x2fcac8 += "\n*®Adams and Carl 2024*\n\n*Now reply this message with the number that matches your choice.*";
  let _0x3d10c2 = await _0x474502.sendMessage(_0x390a0d, {
    'text': _0x2fcac8
  }, {
    'quoted': _0x270336
  });
  let _0xcbe974 = await _0x474502.awaitForMessage({
    'chatJid': _0x390a0d,
    'sender': _0x2ad5d0,
    'timeout': 0xea60,
    'filter': _0x3a4ced => _0x3a4ced.message.extendedTextMessage && _0x3a4ced.message.extendedTextMessage.contextInfo.stanzaId == _0x3d10c2.key.id && _0x3a4ced.message.extendedTextMessage.text > 0 && _0x3a4ced.message.extendedTextMessage.text <= _0x538bf7.length
  });
  let _0x2c0fba = _0xcbe974.message.extendedTextMessage.text - 1;
  const _0xff37de = require("heroku-client");
  const _0x400ba3 = new _0xff37de({
    'token': s.HEROKU_APY_KEY
  });
  let _0x447c41 = "/apps/" + s.HEROKU_APP_NAME;
  await _0x400ba3.patch(_0x447c41 + "/config-vars", {
    'body': {
      [_0x3a4d69]: _0x538bf7[_0x2c0fba]
    }
  });
  await _0x477861("That Heroku variable is changing, The bot is restarting....");
});
function changevars(_0x5633bf, _0x1892d8) {
  adams({
    'nomCom': _0x5633bf,
    'categorie': "HEROKU"
  }, async (_0x5ca256, _0x4e4420, _0xeb8b0a) => {
    const {
      arg: _0x28f698,
      superUser: _0xc035c,
      repondre: _0x34fa66
    } = _0xeb8b0a;
    if (!_0xc035c) {
      _0x34fa66("This command is for my owner only!");
      return;
    }
    ;
    if (s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null) {
      _0x34fa66("Fill in the HEROKU_APP_NAME and HEROKU_API_KEY environment variables");
      return;
    }
    ;
    if (!_0x28f698[0]) {
      _0x34fa66(getDescriptionFromEnv(_0x1892d8));
      return;
    }
    ;
    const _0x429f23 = require("heroku-client");
    const _0x1aa222 = new _0x429f23({
      'token': s.HEROKU_APY_KEY
    });
    let _0x1433f7 = "/apps/" + s.HEROKU_APP_NAME;
    await _0x1aa222.patch(_0x1433f7 + "/config-vars", {
      'body': {
        [_0x1892d8]: _0x28f698.join(" ")
      }
    });
    await _0x34fa66("That Heroku variable is changing, The bot is restarting....");
  });
}
;
changevars("setprefix", "PREFIX");
changevars("menulinks", "BOT_MENU_LINKS");
