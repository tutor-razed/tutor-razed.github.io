
import { GradeLevel, Improbability, Template, WordBank } from './types';

export const TEMPLATES: Template[] = [
  { id: 't1', structure: 'The {adj} {subject} {verb} {obj} in {location}' },
  { id: 't2', structure: '{adj} {subject} found {verb}ing {obj} near {location}' },
  { id: 't3', structure: 'Why this {adj} {subject} decided to {verb} {obj} at {location}' },
  { id: 't4', structure: 'Panic at {location}: {adj} {subject} {verb} {obj}' },
  { id: 't5', structure: 'Exclusive: {adj} {subject} and the mystery of the {obj} in {location}' },
  { id: 't6', structure: 'How a {adj} {subject} {verb} {obj} and changed {location} forever' },
  { id: 't7', structure: 'A {adj} {subject} was seen {verb}ing {obj} inside {location}' },
  { id: 't8', structure: 'The secret life of a {adj} {subject}: {verb}ing {obj} at {location}' },
  { id: 't9', structure: 'Warning: {adj} {subject} is {verb}ing {obj} near {location}' },
  { id: 't10', structure: 'New report shows {adj} {subject} {verb} {obj} in {location}' },
];

export const WORD_BANKS: Record<GradeLevel, Record<Improbability, WordBank>> = {
  elementary: {
    realistic: {
      adjectives: ['Friendly', 'Big', 'Sleepy', 'Kind', 'Fast', 'Small', 'Happy', 'Sad', 'Brave', 'Clumsy', 'Cute', 'Smart', 'Funny', 'Quiet', 'Loud'],
      subjects: ['Puppy', 'Teacher', 'Baker', 'Farmer', 'Cat', 'Bird', 'Hamster', 'Doctor', 'Firefighter', 'Chef', 'Student', 'Coach', 'Artist'],
      verbs: ['lost', 'found', 'made', 'bought', 'helped', 'fixed', 'saw', 'gave', 'painted', 'cleaned', 'baked', 'carried', 'chased'],
      objects: ['a ball', 'a cake', 'a hat', 'a toy', 'a book', 'a bike', 'a chair', 'a flower', 'a lunchbox', 'a crayon', 'a kite', 'a snack'],
      locations: ['the park', 'the school', 'the garden', 'the farm', 'the zoo', 'the library', 'the yard', 'the bedroom', 'the beach'],
    },
    unusual: {
      adjectives: ['Neon', 'Giant', 'Tiny', 'Silly', 'Wobbly', 'Fluffy', 'Glowing', 'Shiny', 'Striped', 'Spiky', 'Sparkly', 'Bouncy'],
      subjects: ['Hamster', 'Robot', 'Dragon', 'Squirrel', 'Alien', 'Monster', 'Unicorn', 'Dinosaur', 'Spaceship', 'Wizard'],
      verbs: ['stole', 'hid', 'painted', 'fixed', 'built', 'shared', 'tricked', 'zapped', 'tamed', 'invented', 'discovered'],
      objects: ['a golden nut', 'a flying bike', 'a giant spoon', 'a secret map', 'a magic wand', 'a rocket', 'a crown', 'a bubble'],
      locations: ['a treehouse', 'the library', 'a bus stop', 'the kitchen', 'a cave', 'the moon', 'a cloud', 'a castle', 'a underwater city'],
    },
    weird: {
      adjectives: ['Floating', 'Singing', 'Invisible', 'Purple', 'Slimey', 'Stretchy', 'Teleporting', 'Whistling', 'Polka-dot', 'Melting'],
      subjects: ['Ghost', 'Panda', 'Cloud', 'Kitten', 'Shadow', 'Marshmallow', 'Bubble', 'Jellyfish', 'Snowman', 'Cactus'],
      verbs: ['ate', 'tickled', 'pushed', 'called', 'warped', 'melted', 'flew', 'dissolved', 'floated', 'bounced'],
      objects: ['a rainbow', 'a cookie', 'a moon', 'a star', 'a dream', 'a thought', 'a laugh', 'a whisper', 'a sneeze'],
      locations: ['the sky', 'a dream', 'a box', 'the ocean', 'a mirror', 'a sock', 'a sandwich', 'a bubbles', 'the fridge'],
    },
    absurd: {
      adjectives: ['Dancing', 'Talking', 'Elastic', 'Gummy', 'Yelling', 'Singing', 'Angry', 'Polite', 'Confused', 'Fancy'],
      subjects: ['Banana', 'Toaster', 'Cactus', 'Balloon', 'Shoe', 'Pencil', 'Mug', 'Remote', 'Clock', 'Potato', 'Door'],
      verbs: ['married', 'scolded', 'blamed', 'befriended', 'divorced', 'hired', 'fired', 'wrote to', 'convinced', 'lectured'],
      objects: ['a shoe', 'a doorbell', 'a cloud', 'a spoon', 'a fork', 'a rug', 'a napkin', 'a button', 'a tissue'],
      locations: ['a volcano', 'a teapot', 'a trampoline', 'a giant shoe', 'a bathtub', 'a mailbox', 'a blender', 'a toaster'],
    },
    unhinged: {
      adjectives: ['Infinite', 'Glitchy', 'Quantum', 'Screaming', 'Static', 'Forgotten', 'Non-existent', 'Upside-down', 'Shattered'],
      subjects: ['Oatmeal', 'Shadow', 'Thought', 'Internet', 'Logic', 'Silence', 'Entropy', 'Vibration', 'Gravity', 'Nothing'],
      verbs: ['deleted', 'multiplied', 'consumed', 'transcended', 'glitched', 'forgot', 'warped', 'erased', 'imploded'],
      objects: ['the universe', 'a logic loop', 'a pixel', 'nothingness', 'the fourth wall', 'a memory', 'the future', 'a feeling'],
      locations: ['the void', 'a black hole', 'a mirror', 'inside a hat', 'nowhere', 'everywhere', 'the end of time', 'a dream'],
    }
  },
  middle: {
    realistic: {
      adjectives: ['Ambitious', 'Local', 'Dedicated', 'Aggressive', 'Persistent', 'Reliable', 'Successful', 'Creative', 'Diverse', 'Public'],
      subjects: ['Mayor', 'Scientist', 'Coach', 'Student', 'Principal', 'Officer', 'Witness', 'Citizen', 'Parent', 'Volunteer'],
      verbs: ['unveiled', 'rejected', 'proposed', 'investigated', 'confirmed', 'denied', 'delayed', 'launched', 'solved', 'organized'],
      objects: ['a plan', 'a theory', 'a law', 'a budget', 'a project', 'a building', 'a community', 'a park', 'a system'],
      locations: ['City Hall', 'the laboratory', 'the stadium', 'the auditorium', 'the square', 'the library', 'the center', 'the office'],
    },
    unusual: {
      adjectives: ['Mysterious', 'Suspicious', 'Exotic', 'Advanced', 'Hidden', 'Strange', 'Forgotten', 'Lost', 'Antique', 'Rare'],
      subjects: ['Journalist', 'Archaeologist', 'Inventor', 'Pilot', 'Explorer', 'Merchant', 'Guard', 'Detective', 'Scholar'],
      verbs: ['discovered', 'activated', 'encoded', 'retrieved', 'deciphered', 'opened', 'stumbled upon', 'identified', 'cloned'],
      objects: ['a relic', 'a prototype', 'a signal', 'a vault', 'a scroll', 'a device', 'a key', 'a compass', 'a map'],
      locations: ['the desert', 'an attic', 'a hangar', 'the coast', 'the jungle', 'the basement', 'the mountains', 'the tunnel'],
    },
    weird: {
      adjectives: ['Telepathic', 'Radioactive', 'Ancient', 'Sentient', 'Cursed', 'Hybrid', 'Symbiotic', 'Paradoxical', 'Temporal'],
      subjects: ['Artificial Intelligence', 'Mutant', 'Spirit', 'Algorithm', 'Avatar', 'Cyborg', 'Entity', 'Presence'],
      verbs: ['hacked', 'manipulated', 'haunted', 'restored', 'awakened', 'simulated', 'absorbed', 'echoed', 'mutated'],
      objects: ['the grid', 'humanity', 'the archive', 'the portal', 'the frequency', 'the data', 'the soul', 'the dimension'],
      locations: ['the server room', 'the ruins', 'the ether', 'the basement', 'the lab', 'the simulation', 'the core'],
    },
    absurd: {
      adjectives: ['Nihilistic', 'Wobbly', 'Bureaucratic', 'Sentimental', 'Petty', 'Frantic', 'Apathetic', 'Dramatic', 'Ironical'],
      subjects: ['Paperclip', 'Committee', 'Llama', 'Sandwich', 'Statue', 'Tax Collector', 'Broom', 'Hat', 'Glove', 'Fork'],
      verbs: ['standardized', 'outlawed', 'worshipped', 'ignored', 'sued', 'promoted', 'interviewed', 'crowned', 'blamed'],
      objects: ['gravity', 'Tuesday', 'the alphabet', 'existence', 'silence', 'paperwork', 'a meeting', 'the weather'],
      locations: ['the DMV', 'a pocket dimension', 'the fridge', 'a meeting', 'the hallway', 'a cubicle', 'a waiting room'],
    },
    unhinged: {
      adjectives: ['Hyper-dimensional', 'Eldritch', 'Recursive', 'Apocalyptic', 'Static', 'Noise-filled', 'Void-born', 'Labyrinthine'],
      subjects: ['Meme', 'Static', 'Entropy', 'Paradox', 'Vibe', 'Echo', 'Glitched Reality', 'Unconscious Mind', 'Concept'],
      verbs: ['erased', 'inverted', 'hallucinated', 'dissolved', 'shattered', 'rewrote', 'duplicated', 'corrupted', 'ceased'],
      objects: ['the concept of time', 'reality', 'your memories', 'the sun', 'the universe', 'the self', 'everything'],
      locations: ['the end of time', 'the backrooms', 'a forgotten folder', 'everywhere', 'nowhere', 'the void'],
    }
  },
  high: {
    realistic: {
      adjectives: ['Controversial', 'Diplomatic', 'Systemic', 'Fiscal', 'Pragmatic', 'Radical', 'Conservative', 'Liberal', 'Traditional', 'Modern'],
      subjects: ['Politician', 'CEO', 'Activist', 'Philosopher', 'Lobbyist', 'Analyst', 'Pundit', 'Strategist', 'Critic', 'Founder'],
      verbs: ['challenged', 'endorsed', 'critiqued', 'manipulated', 'negotiated', 'reformed', 'stagnated', 'pivoted', 'advocated'],
      objects: ['the establishment', 'the treaty', 'the paradigm', 'the economy', 'the narrative', 'the consensus', 'the status quo'],
      locations: ['the summit', 'the boardroom', 'the square', 'the institute', 'the assembly', 'the convention', 'the forum'],
    },
    unusual: {
      adjectives: ['Underground', 'Subversive', 'Avant-garde', 'Crypto-', 'Anonymous', 'Rogue', 'Synthetic', 'Virtual', 'Quantum'],
      subjects: ['Hacker', 'Dissident', 'Visionary', 'Whistleblower', 'Rebel', 'Agent', 'Mercenary', 'Syndicate', 'Cabal'],
      verbs: ['leaked', 'disrupted', 'redefined', 'exposed', 'encrypted', 'sabotaged', 'infiltrated', 'weaponized', 'bypassed'],
      objects: ['the scandal', 'the industry', 'the narrative', 'the conspiracy', 'the firewall', 'the prototype', 'the blueprint'],
      locations: ['the dark web', 'the underground', 'the embassy', 'the field', 'the archive', 'the secure site', 'the safehouse'],
    },
    weird: {
      adjectives: ['Transcendent', 'Dystopian', 'Metaphysical', 'Subliminal', 'Occult', 'Celestial', 'Esoteric', 'Neural', 'Post-human'],
      subjects: ['Cyborg', 'Entity', 'Construct', 'Oracle', 'Overlord', 'Ascendant', 'Simulacrum', 'Archetype', 'Harbinger'],
      verbs: ['merged', 'subjugated', 'replicated', 'simulated', 'transcended', 'integrated', 'manifested', 'interfaced'],
      objects: ['the collective', 'the ego', 'the simulation', 'the subconscious', 'the singularity', 'the nexus', 'the source'],
      locations: ['the neural network', 'the wasteland', 'the singularity', 'the sanctum', 'the mainframe', 'the frontier'],
    },
    absurd: {
      adjectives: ['Kafkaesque', 'Dadaist', 'Surreal', 'Nonsensical', 'Futile', 'Absurd', 'Grotesque', 'Obscure', 'Abstract'],
      subjects: ['Inanimate Object', 'Contradiction', 'Tax Form', 'Void', 'Logic Loop', 'Ambiguity', 'Anachronism', 'Paradox'],
      verbs: ['arbitrated', 'rationalized', 'transmuted', 'liquidated', 'standardized', 'justified', 'neutralized', 'negated'],
      objects: ['the meaning of life', 'nothing', 'a paradox', 'a joke', 'a coincidence', 'a formality', 'an error'],
      locations: ['the edge of reason', 'the court', 'the void', 'the theater', 'the waiting room', 'the maze', 'the archive'],
    },
    unhinged: {
      adjectives: ['Interstellar', 'Primordial', 'Singular', 'Fractal', 'Abyssal', 'Cosmic', 'Incomprehensible', 'Timeless', 'Static'],
      subjects: ['God-particle', 'Memory', 'Void-beast', 'Frequency', 'Signal', 'Anomaly', 'Singularity', 'Radiance', 'Vessel'],
      verbs: ['rewrote', 'shattered', 'imploded', 'congealed', 'erased', 'scattered', 'ignited', 'echoed', 'collided'],
      objects: ['the fabric of being', 'logic', 'the light', 'the absolute', 'the void', 'the horizon', 'the silence'],
      locations: ['the zero-point', 'the abyss', 'the core', 'the event horizon', 'the origin', 'the end', 'the gap'],
    }
  }
};

export const CONSTRAINTS: Record<GradeLevel, string[]> = {
  elementary: [
    'Include a clear character who wants something.',
    'Describe the setting using at least two colors.',
    'Make sure there is a problem that gets solved.',
    'Use at least three "sound" words (Onomatopoeia).'
  ],
  middle: [
    'Include a quote from a witness or an expert.',
    'Use sensory details for sight, smell, and sound.',
    'Introduce a complication that makes the problem harder.',
    'Focus on using at least five strong, action-oriented verbs.'
  ],
  high: [
    'Include a skeptical voice or a counterargument to the main event.',
    'Use at least one rhetorical device (metaphor, irony, or hyperbole).',
    'Create a sense of ethical tension or ambiguity.',
    'Use vocabulary that reflects the specific tone of the piece.'
  ]
};

export const TONE_MODIFIERS: Record<string, string[]> = {
  serious: ["Sources indicate grave consequences.", "Officials are closely monitoring the situation.", "A turning point for the community."],
  satire: ["Experts agree this is mostly a misunderstanding.", "Local residents are thoroughly confused, as usual.", "The first of its kind, unfortunately."],
  horror: ["Few survived to tell the tale.", "The shadows at the scene seem to move on their own.", "A chill has settled over the town."],
  inspirational: ["A heartwarming reminder of human resilience.", "Against all odds, hope finds a way.", "This will be remembered for generations to come."],
  'sci-fi': ["The implications for the timeline are unclear.", "Technicians are attempting to stabilize the rift.", "A new era of discovery begins today."],
  mystery: ["The true motives remain shrouded in secrecy.", "Clues found at the scene only raise more questions.", "Someone knows the truth, but they aren't talking."],
  fairy_tale: ["And so the magic began to weave its spell.", "Long ago prophesied, finally fulfilled.", "A lesson to all who wander too far."],
  cynical: ["Just another day in this predictable world.", "Most people saw this coming years ago.", "Another expensive mistake by those in charge."],
  random: ["It was bound to happen eventually.", "Expect the unexpected, or just wait for it to end.", "The weather was surprisingly nice during all of this."]
};

export const SECTIONS = ['Breaking News', 'Local', 'Politics', 'Opinion', 'Tech', 'Culture', 'Science', 'Strange', 'Sports'];

export const FICTIONAL_ADS = [
  { title: "Hover-Step 3000", desc: "Walking is so last century. Glide into the future.", img: "tech" },
  { title: "Granny's Gourd Juice", desc: "100% Organic, 200% Strange. Tastes like nostalgia.", img: "food" },
  { title: "Dream-O-Matic", desc: "Choose your dreams tonight. Subscriptions start at $9.99.", img: "nature" },
  { title: "Instant-A-Bridge", desc: "Need to cross a river? Just add water and wait 5 seconds.", img: "city" },
  { title: "Self-Cleaning Socks", desc: "The only pair you'll ever need. Guaranteed for a century.", img: "fashion" }
];

export const CLASSIFIEDS = [
  { cat: "HELP WANTED", text: "Dragon Whisperer. Must have own fireproof suit and valid lizard license." },
  { cat: "FOR SALE", text: "Time machine (slightly used). Only travels to last Tuesday. $50 or best offer." },
  { cat: "LOST & FOUND", text: "Lost: One invisible cat. If seen (or felt), please call 555-0102." },
  { cat: "SERVICES", text: "Professional cloud-painter. All shapes and sizes. Satisfaction guaranteed." },
  { cat: "ANNOUNCEMENTS", text: "The Tuesday Club is moving to Wednesday, effective immediately." }
];
