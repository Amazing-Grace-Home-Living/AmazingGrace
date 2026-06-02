export function getGuardianChallenge(hud) {
  const virtue = hud?.virtueEngine || { corruption: 0, love: 0, truth: 0 };
  const corruption = virtue.corruption ?? 0;
  const love = virtue.love ?? 0;
  const truth = virtue.truth ?? 0;

  if (corruption >= 8) {
    return {
      type: "deny",
      message: "“Your conscience is clouded with darkness. The guardians bar the entrance: you may not pass.”"
    };
  }

  if (truth < 3) {
    return {
      type: "question",
      message: "“A spirit of insincerity hangs over you. The guardians challenge: 'What truth do you fear to speak?'”"
    };
  }

  if (love < 3) {
    return {
      type: "question",
      message: "“Your heart lacks warmth. The guardians challenge: 'Whom have you withheld compassion from?'”"
    };
  }

  return {
    type: "allow",
    message: "“Your path is clear. The guardians step aside: 'You may enter the sacred chamber.'”"
  };
}
