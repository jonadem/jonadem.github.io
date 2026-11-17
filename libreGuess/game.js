"use strict";

const englishDecks = [
  { name: "Wild Things", icon: "🐾", description: "Animals big and small",
    words: "Red panda|Flamingo|Octopus|Meerkat|Hedgehog|Giraffe|Great white shark|Kangaroo|Sloth|Penguin|Chameleon|Bald eagle|Koala|Sea turtle|Jellyfish|Bat|Capybara|Snow leopard|Orangutan|Platypus|Porcupine|Hummingbird|Walrus|Crocodile" },
  { name: "Act It Out", icon: "🎭", description: "Charades and silly actions",
    words: "Walking on the moon|Brushing your teeth|Getting stuck in an elevator|Flying a kite|Catching a fish|Singing in the shower|Walking a tightrope|Hailing a taxi|Carrying a heavy box|Peeling a banana|Making a snow angel|Ice skating|Juggling|Walking a stubborn dog|Taking a selfie|Doing a cartwheel|Trying on tiny shoes|Swatting a mosquito|Paddling a canoe|Building a sandcastle|Lighting birthday candles|Opening an umbrella|Playing air guitar|Changing a tire" },
  { name: "Snack Attack", icon: "🍿", description: "Tasty food and drinks",
    words: "Popcorn|Spaghetti|Chocolate chip cookie|Avocado|Bubble tea|Waffle|Pickles|Dumplings|Cotton candy|Taco|Blueberry muffin|Pineapple|Pretzel|Mashed potatoes|Pancakes|Sushi|Ice cream sandwich|Cinnamon roll|Nachos|Grilled cheese|Hot chocolate|Watermelon|French fries|Lemonade" },
  { name: "Everyday Stuff", icon: "💡", description: "Things you know by heart",
    words: "Toothbrush|Alarm clock|Garden hose|Shopping cart|Doorbell|Rubber duck|Sleeping bag|Sticky note|Microscope|Sunglasses|Traffic light|Watering can|Fire extinguisher|Flashlight|Tape measure|Suitcase|Remote control|Scissors|Hair dryer|Doormat|Snow globe|Laundry basket|Elevator button|Pencil sharpener" }
];

const frenchDecks = [
  { name: "Animaux", icon: "🐾", description: "Des petites et des grosses bêtes",
    words: "Panda roux|Flamant rose|Poulpe|Suricate|Hérisson|Girafe|Grand requin blanc|Kangourou|Paresseux|Manchot|Caméléon|Pygargue à tête blanche|Koala|Tortue de mer|Méduse|Chauve-souris|Capybara|Léopard des neiges|Orang-outan|Ornithorynque|Porc-épic|Colibri|Morse|Crocodile" },
  { name: "À mimer", icon: "🎭", description: "Des gestes et des situations rigolotes",
    words: "Marcher sur la Lune|Se brosser les dents|Rester coincé dans un ascenseur|Faire voler un cerf-volant|Attraper un poisson|Chanter sous la douche|Marcher sur un fil|Héler un taxi|Porter un carton lourd|Éplucher une banane|Faire un ange dans la neige|Faire du patin à glace|Jongler|Promener un chien têtu|Prendre un selfie|Faire la roue|Essayer des chaussures trop petites|Écraser un moustique|Pagayer en canoë|Construire un château de sable|Allumer des bougies d’anniversaire|Ouvrir un parapluie|Jouer de la guitare imaginaire|Changer un pneu" },
  { name: "À table !", icon: "🍿", description: "À boire et à manger",
    words: "Pop-corn|Spaghettis|Cookie aux pépites de chocolat|Avocat|Thé aux perles|Gaufre|Cornichons|Raviolis|Barbe à papa|Taco|Muffin aux myrtilles|Ananas|Bretzel|Purée de pommes de terre|Pancakes|Sushis|Sandwich glacé|Brioche à la cannelle|Nachos|Sandwich grillé au fromage|Chocolat chaud|Pastèque|Frites|Limonade" },
  { name: "Objets du quotidien", icon: "💡", description: "Des objets familiers",
    words: "Brosse à dents|Réveil|Tuyau d’arrosage|Chariot de courses|Sonnette|Canard en plastique|Sac de couchage|Pense-bête autocollant|Microscope|Lunettes de soleil|Feu tricolore|Arrosoir|Extincteur|Lampe de poche|Mètre ruban|Valise|Télécommande|Ciseaux|Sèche-cheveux|Paillasson|Boule à neige|Panier à linge|Bouton d’ascenseur|Taille-crayon" }
];

const french = document.documentElement.lang === "fr";
const decks = french ? frenchDecks : englishDecks;
const copy = french ? {
  timeUp: "Temps écoulé !",
  deckEnd: "Vous avez terminé la catégorie.",
  ended: "Manche interrompue.",
  score: (count) => count + (count > 1 ? " mots trouvés" : " mot trouvé"),
  total: (count) => copy.score(count) + " !",
  passes: (count) => count + (count > 1 ? " mots passés." : " mot passé."),
  correct: "Trouvé",
  passed: "Passé",
  tiltGuide: "Inclinez le téléphone vers le bas pour valider ou vers le haut pour passer. Redressez-le entre chaque mot.",
  tiltUnavailable: "Les gestes sont indisponibles ici. Utilisez les boutons ou les flèches du clavier.",
  tiltDenied: "L’accès aux capteurs est indisponible. Utilisez les boutons ou les flèches du clavier.",
  tiltEnable: "Activer les gestes",
  tiltDisable: "Désactiver les gestes",
  tiltWaiting: "En attente des données de mouvement. Les boutons restent utilisables."
} : {
  timeUp: "Time’s up!",
  deckEnd: "You reached the end of the deck.",
  ended: "Round ended early.",
  score: (count) => count + " correct",
  total: (count) => count + " correct!",
  passes: (count) => count + (count === 1 ? " pass." : " passes."),
  correct: "Correct",
  passed: "Passed",
  tiltGuide: "Tilt down for correct, up to pass. Return upright between cards.",
  tiltUnavailable: "Tilt is unavailable here. Use the round buttons or arrow keys.",
  tiltDenied: "Tilt access is unavailable. Use the round buttons or arrow keys.",
  tiltEnable: "Enable tilt",
  tiltDisable: "Disable tilt",
  tiltWaiting: "Waiting for motion data. Round buttons are always available."
};

const byId = (id) => document.getElementById(id);
const stages = ["setup", "ready", "round", "results"];
let screen = "setup";
let selected = 0;
let tiltEnabled = false;
let tiltPending = false;
let neutralAngle = null;
let tiltArmed = false;
let round = null;
let interval;

function show(next, focusId) {
  screen = next;
  for (const stage of stages) byId(stage).hidden = stage !== next;
  const focus = focusId ? byId(focusId) : byId(next).querySelector("h2");
  focus?.focus();
}

for (const [index, deck] of decks.entries()) {
  const button = document.createElement("button");
  button.className = "deck";
  button.setAttribute("aria-pressed", String(index === selected));
  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = deck.icon;
  const description = document.createElement("small");
  description.textContent = deck.description;
  button.append(icon, deck.name, description);
  button.addEventListener("click", () => {
    byId("decks").children[selected].setAttribute("aria-pressed", "false");
    selected = index;
    button.setAttribute("aria-pressed", "true");
  });
  byId("decks").append(button);
}

function shuffle(words) {
  const cards = words.split("|");
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}

function startRound() {
  const duration = Number(document.querySelector('input[name="duration"]:checked').value);
  round = {
    cards: shuffle(decks[selected].words),
    answers: [],
    correct: 0,
    deadline: performance.now() + duration * 1000
  };
  neutralAngle = null;
  tiltArmed = false;
  byId("deck-name").textContent = decks[selected].name;
  renderCard();
  updateClock();
  show("round", "word");
  interval = window.setInterval(updateClock, 100);
}

function updateClock() {
  const seconds = Math.max(0, Math.ceil((round.deadline - performance.now()) / 1000));
  const minutes = Math.floor(seconds / 60);
  byId("timer").textContent = minutes + ":" + String(seconds % 60).padStart(2, "0");
  byId("timer").dateTime = "PT" + seconds + "S";
  if (seconds === 0 && screen === "round") finish(copy.timeUp);
}

function renderCard() {
  byId("word").textContent = round.cards[round.answers.length];
  byId("score").textContent = copy.score(round.correct);
}

function answer(correct) {
  if (screen !== "round") return;
  if (performance.now() >= round.deadline) {
    finish(copy.timeUp);
    return;
  }
  round.answers.push({ word: round.cards[round.answers.length], correct });
  if (correct) round.correct += 1;
  if (round.answers.length === round.cards.length) {
    finish(copy.deckEnd);
  } else {
    renderCard();
  }
}

function finish(reason) {
  window.clearInterval(interval);
  byId("total").textContent = copy.total(round.correct);
  const passes = round.answers.length - round.correct;
  byId("summary").textContent = reason + " " + copy.passes(passes);
  const history = round.answers.map(({ word, correct }) => {
    const entry = document.createElement("li");
    const result = document.createElement("small");
    result.textContent = correct ? copy.correct : copy.passed;
    entry.append(word, result);
    return entry;
  });
  byId("history").replaceChildren(...history);
  show("results", "total");
}

function angleFor(event) {
  const rotation = window.screen.orientation?.angle ?? window.orientation ?? 0;
  if (rotation === 90) return event.gamma;
  if (rotation === 270 || rotation === -90) return event.gamma === null ? null : -event.gamma;
  return event.beta;
}

function handleTilt(event) {
  if (!tiltEnabled) return;
  const angle = angleFor(event);
  if (angle === null || !Number.isFinite(angle)) return;
  byId("tilt-status").textContent = copy.tiltGuide;
  if (screen !== "round") return;
  if (neutralAngle === null) neutralAngle = angle;
  const movement = ((angle - neutralAngle + 540) % 360) - 180;
  if (Math.abs(movement) < 12) tiltArmed = true;
  if (!tiltArmed || Math.abs(movement) < 33) return;
  tiltArmed = false;
  answer(movement < 0);
}

byId("tilt").addEventListener("click", async () => {
  if (tiltPending) return;
  const status = byId("tilt-status");
  if (!tiltEnabled) {
    if (!window.DeviceOrientationEvent || !window.isSecureContext) {
      status.textContent = copy.tiltUnavailable;
      return;
    }
    tiltPending = true;
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function" &&
          await DeviceOrientationEvent.requestPermission() !== "granted") {
        throw new Error("Tilt permission declined");
      }
    } catch {
      status.textContent = copy.tiltDenied;
      return;
    } finally {
      tiltPending = false;
    }
  }
  tiltEnabled = !tiltEnabled;
  byId("tilt").setAttribute("aria-pressed", String(tiltEnabled));
  byId("tilt").textContent = tiltEnabled ? copy.tiltDisable : copy.tiltEnable;
  status.textContent = tiltEnabled ? copy.tiltWaiting : "";
});

window.addEventListener("deviceorientation", handleTilt);
window.screen.orientation?.addEventListener("change", () => {
  neutralAngle = null;
  tiltArmed = false;
});
byId("start").addEventListener("click", () => show("ready"));
byId("again").addEventListener("click", () => show("ready"));
byId("back").addEventListener("click", () => show("setup", "start"));
byId("home").addEventListener("click", () => {
  show("setup", "start");
  byId("decks").children[selected].focus();
});
byId("go").addEventListener("click", startRound);
byId("correct").addEventListener("click", () => answer(true));
byId("pass").addEventListener("click", () => answer(false));
byId("end").addEventListener("click", () => finish(copy.ended));
document.addEventListener("keydown", (event) => {
  if (screen !== "round" || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  if (!event.repeat) answer(event.key === "ArrowRight");
});
