import loreData from "./lore.json";

export function useSevenStarsLore() {
  const stars = loreData.stars;

  function getStarById(id) {
    return stars.find(s => s.id === id) || null;
  }

  function getRandomStar() {
    return stars[Math.floor(Math.random() * stars.length)];
  }

  return { stars, getStarById, getRandomStar };
}
