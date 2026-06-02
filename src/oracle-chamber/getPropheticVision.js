export function getPropheticVision(hud) {
  const virtue = hud?.virtueEngine || { truth: 0, love: 0, wisdom: 0, corruption: 0 };
  const stars = hud?.progress?.sevenStars?.collected?.length || 0;
  const lamps = hud?.lamps?.activated?.length || 0;
  const corruption = virtue.corruption || 0;
  const love = virtue.love || 0;

  if (corruption >= 7) {
    return {
      text: "A thick, crimson smoke wraps around the altar of incense, whispering of fractured covenants. You see the likeness of a broken branch, dry and devoid of water. Calibration is required to clear the channels.",
      tone: "Severe"
    };
  }

  if (stars === 7 && lamps === 7) {
    return {
      text: "A glorious alignment of seven brilliant stars circles the burning lamps. In the center, a sea of glass like crystal sparkles. The voice says: 'What was, and is, and is to come, is laid open before you.'",
      tone: "Transcendent"
    };
  }

  if (lamps >= 5) {
    return {
      text: "Seven golden lampstands burn brightly, their flames dancing in synchronization. You see a vision of a pathway winding up a holy mountain, illuminated by seven torches of fire.",
      tone: "Illuminated"
    };
  }

  if (stars >= 5) {
    return {
      text: "A constellation of stars descends like crowns onto the sanctuary. The oracle whispers: 'Hold fast to that which you have, so that no one may take your crown.'",
      tone: "Prophetic"
    };
  }

  if (love >= 5) {
    return {
      text: "A spring of living water wells up from beneath the altar, flowing outward to form a wide, healing river. You see green leaves of the tree of life bearing twelve kinds of fruit for the healing of nations.",
      tone: "Gentle"
    };
  }

  return {
    text: "A soft, shimmering light reveals a scroll sealed with seven seals, lying upon a table of cedar. The silence in heaven lasts for a space of half an hour, waiting for the scroll to be opened.",
    tone: "Contemplative"
  };
}
