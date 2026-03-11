import type { SymbolDefinition } from '../types'

export const symbols: SymbolDefinition[] = [
  {
    id: 'star',
    label: 'Star',
    title: 'Your Hopes, Wishes, Dreams & Desires!',
    coachingPrompt: 'What is the goal of this session?',
    accentVar: '--symbol-star',
  },
  {
    id: 'circles',
    label: 'Circles',
    title: 'Teamwork makes the Dream Work!',
    coachingPrompt: "Who can help them reach the goals in today's session?",
    accentVar: '--symbol-circles',
  },
  {
    id: 'clapperboard',
    label: 'Clapperboard',
    title: 'Take 1 to Take 101',
    coachingPrompt:
      "What mistakes and ACTions are we going through with the Learner to help the Learner figure out what they don't know?",
    accentVar: '--symbol-clapperboard',
  },
  {
    id: 'litmus-strip',
    label: 'Litmus Strip',
    title: 'What are Your Passions?',
    coachingPrompt:
      'Which passions are you bringing to help them understand the work and make it relevant? Or what can you use as a reward once they get through this?',
    accentVar: '--symbol-litmus',
  },
  {
    id: 'heart',
    label: 'Heart',
    title: 'You Can Do It!',
    coachingPrompt:
      'Are any stories preventing them from reaching their stars? Are you helping them create new stories of confidence and ability?',
    accentVar: '--symbol-heart',
  },
  {
    id: 'stop-sign',
    label: 'Amber Highlighted Stop Sign',
    title: "Don't Rush Through Life!",
    coachingPrompt:
      'Are they able to stop freezing? Are you able to slow it down for them?',
    accentVar: '--symbol-stop-sign',
  },
  {
    id: 'target',
    label: 'Target',
    title: 'S.M.A.R.T. Goal Setting System',
    coachingPrompt:
      'Are they closer to reaching their stars than the last tutoring session? What do they need to do between tutoring sessions to get closer to their stars?',
    accentVar: '--symbol-target',
  },
  {
    id: 'happy-face',
    label: 'Happy Face',
    title: 'Happy...Just Because!',
    coachingPrompt:
      'How are you helping them keep their spirits up while they strive for their GOALs? Are you helping them control their own feelings?',
    accentVar: '--symbol-happy-face',
  },
]
