import type { CardChoice, CardOutcome, MiniChallenge, SymbolCard, SymbolType } from '../types'

type CardSeed = Omit<SymbolCard, 'id' | 'symbolType'>
type ChallengeSeed = Omit<MiniChallenge, 'id' | 'symbolType'>

export const symbolCards: SymbolCard[] = [
  ...buildCards('star', [
    card(
      'Name the finish line',
      'What would make this session feel successful for your player?',
      'reflection',
      [
        choice('Write one clear success sentence', { credits: 2, milestone: 'goalDefined', narration: 'A clear goal gives the team direction.' }),
        choice('Ask Amber to simplify the goal', { credits: 1, supportTokens: 1, narration: 'A smaller goal still counts as progress.' }),
      ],
    ),
    card('Dreams into steps', 'Choose the next step that best moves the learner toward their star.', 'opportunity', [
      choice('Pick one step you can finish today', { credits: 2, milestone: 'goalDefined' }),
      choice('Break the goal into two tiny actions', { credits: 1, supportTokens: 1 }),
    ]),
    card('Star map', 'How can the team make the big goal feel easier to follow?', 'reflection', [
      choice('Draw a quick path with three checkpoints', { credits: 2, milestone: 'goalDefined' }),
      choice('Circle the first checkpoint only', { credits: 1, supportTokens: 1 }),
    ]),
    card('Wish list check', 'Which goal is most ready for action right now?', 'opportunity', [
      choice('Pick the goal that matters most today', { credits: 2 }),
      choice('Shrink the goal so it fits this turn', { credits: 1, supportTokens: 1, milestone: 'goalDefined' }),
    ]),
    card('Future self note', 'What would the learner thank themselves for after this session?', 'reflection', [
      choice('Finish one action they can feel proud of', { credits: 2 }),
      choice('Write a reminder for the next session', { credits: 1, milestone: 'goalDefined' }),
    ]),
    card('Bright direction', 'What keeps the goal from becoming too fuzzy?', 'challenge', [
      choice('Say the goal out loud in one sentence', { credits: 2, milestone: 'goalDefined' }),
      choice('Ask the group to help sharpen the wording', { credits: 1, supportTokens: 1 }),
    ]),
    card('Why this matters', 'How can the team reconnect to purpose when energy drops?', 'reflection', [
      choice('Name one reason the goal matters today', { credits: 2 }),
      choice('Choose a reward that keeps the goal worth it', { credits: 1, supportTokens: 1 }),
    ]),
    card('North star', 'Which choice helps the learner stay oriented when there are many tasks?', 'opportunity', [
      choice('Highlight the single most important task', { credits: 2, milestone: 'goalDefined' }),
      choice('Sort tasks into now and later', { credits: 1 }),
    ]),
    card('Tiny victory plan', 'What is the smallest action that still moves the session forward?', 'challenge', [
      choice('Choose one action that can be finished in minutes', { credits: 2 }),
      choice('Trade one big action for two tiny ones', { credits: 1, supportTokens: 1 }),
    ]),
    card('Goal reminder', 'The team is drifting. What gets everyone back on the same page?', 'reflection', [
      choice('Repeat the shared goal together', { credits: 2, milestone: 'goalDefined' }),
      choice('Let one player restate the plan in their own words', { credits: 1 }),
    ]),
    card('Next step spotlight', 'How do you keep a big dream from becoming a stressful blur?', 'opportunity', [
      choice('Spotlight the very next step only', { credits: 2 }),
      choice('Write down the next step and one backup step', { credits: 1, supportTokens: 1 }),
    ]),
    card('Possible today', 'Which response keeps hope realistic and useful?', 'challenge', [
      choice('Choose a goal that is possible today', { credits: 2, milestone: 'goalDefined' }),
      choice('Ask Amber to turn the wish into a plan', { credits: 1, supportTokens: 1 }),
    ]),
    card('Star sentence', 'Which response gives the learner a clear star to aim for before the turn ends?', 'reflection', [
      choice('Say the goal as one sentence with one finish point', { credits: 2, milestone: 'goalDefined' }),
      choice('Pick one part of the dream to focus on today', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('circles', [
    card('Team Assist', 'Who can help move this turn forward?', 'opportunity', [
      choice('Invite the group to help', { supportTokens: 2, milestone: 'supportShared', teamAssist: true }),
      choice('Pair one player with one helper', { credits: 1, supportTokens: 1, milestone: 'supportShared' }),
    ]),
    card('Share the load', 'A teammate is behind. What is the fairest support move?', 'reflection', [
      choice('Spend support to help them catch up', { supportTokens: -1, credits: 2, teamAssist: true }),
      choice('Check what help they actually want', { credits: 1, supportTokens: 1 }),
    ]),
    card('Circle check-in', 'How does the group make sure support feels welcome?', 'reflection', [
      choice('Ask what kind of help feels useful', { credits: 1, supportTokens: 1, milestone: 'supportShared' }),
      choice('Offer two help options and let them choose', { credits: 2, milestone: 'supportShared' }),
    ]),
    card('Bench buddy', 'Someone looks stuck. What should the team do first?', 'challenge', [
      choice('Sit beside them and tackle one part together', { credits: 2, milestone: 'supportShared' }),
      choice('Use one support token to lighten the turn', { supportTokens: -1, credits: 1 }),
    ]),
    card('Helper rotation', 'How do you keep one person from carrying all the support work?', 'opportunity', [
      choice('Rotate helpers so everyone contributes', { credits: 2, supportTokens: 1 }),
      choice('Invite a quiet teammate to step in', { credits: 1, milestone: 'supportShared' }),
    ]),
    card('Ask before acting', 'Which response respects the learner while still helping?', 'reflection', [
      choice('Ask permission before stepping in', { credits: 2, milestone: 'supportShared' }),
      choice('Offer help and wait for their signal', { credits: 1, supportTokens: 1 }),
    ]),
    card('Shared strength', 'How can the group use different strengths without confusion?', 'opportunity', [
      choice('Give each helper one clear job', { credits: 2 }),
      choice('Pick the teammate with the best fit for this moment', { credits: 1, supportTokens: 1 }),
    ]),
    card('Catch-up lane', 'A player has fallen behind. What keeps the game cooperative?', 'challenge', [
      choice('Spend support and help them finish the next step', { supportTokens: -1, credits: 2, teamAssist: true }),
      choice('Pause and let them name the hardest part first', { credits: 1, supportTokens: 1 }),
    ]),
    card('Warm handoff', 'How do you pass help from one teammate to another smoothly?', 'reflection', [
      choice('Summarize what has already helped', { credits: 2 }),
      choice('Have the learner tell the next helper what they need', { credits: 1, milestone: 'supportShared' }),
    ]),
    card('Group promise', 'What keeps the team focused on everyone graduating together?', 'opportunity', [
      choice('State one promise to leave no one stuck', { credits: 2, supportTokens: 1 }),
      choice('Spend a token to boost the player who is furthest back', { supportTokens: -1, credits: 2 }),
    ]),
    card('Encouraging chorus', 'What kind of team response helps without overwhelming someone?', 'challenge', [
      choice('Give one calm helpful idea at a time', { credits: 2 }),
      choice('Choose one spokesperson while others listen', { credits: 1, supportTokens: 1 }),
    ]),
    card('Circle reset', 'The team is talking over one another. What fixes it?', 'reflection', [
      choice('Pause and let one voice guide the next step', { credits: 2 }),
      choice('Use support to create a calmer moment', { supportTokens: -1, credits: 1 }),
    ]),
    card('Support circle', 'Which move makes help feel shared instead of one-sided?', 'reflection', [
      choice('Let the learner choose who helps and how', { credits: 2, milestone: 'supportShared' }),
      choice('Offer one support move and one listening move', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('clapperboard', [
    card('Learn from the miss', 'A mistake shows up. What is the best next action?', 'challenge', [
      choice('Name the mistake and try again', { credits: 1, narration: 'Retrying turns a setback into a lesson.' }),
      choice('Pause and ask what feels confusing', { supportTokens: 1, credits: 1 }),
    ]),
    card('Take 2', 'How do you keep a rough start from becoming a stuck turn?', 'challenge', [
      choice('Model one example together', { credits: 2 }),
      choice('Laugh, reset, and try a smaller version', { supportTokens: 1, credits: 1 }),
    ]),
    card('Replay the scene', 'What is the healthiest way to revisit a mistake?', 'reflection', [
      choice('Show what changed between try one and try two', { credits: 2 }),
      choice('Underline the part that already improved', { credits: 1, supportTokens: 1 }),
    ]),
    card('Missed line', 'The learner forgot a step. What should happen next?', 'challenge', [
      choice('Return to the missing step without blame', { credits: 2 }),
      choice('Use support to make the retry feel safer', { supportTokens: -1, credits: 1 }),
    ]),
    card('Behind the scenes', 'How do you help someone notice what went wrong without shame?', 'reflection', [
      choice('Talk through the moment calmly', { credits: 2 }),
      choice('Ask them what they would try differently next', { credits: 1 }),
    ]),
    card('Bloopers help', 'A funny mistake happens. How can the team use it well?', 'opportunity', [
      choice('Laugh kindly and learn from it', { credits: 2 }),
      choice('Turn the blooper into a gentle example', { credits: 1, supportTokens: 1 }),
    ]),
    card('Director note', 'What kind of feedback moves the turn forward fastest?', 'reflection', [
      choice('Give one precise correction', { credits: 2 }),
      choice('Show the correction, then let them try', { credits: 1 }),
    ]),
    card('Retake with support', 'The retry still feels hard. What should the team do?', 'challenge', [
      choice('Spend support to remove one pressure point', { supportTokens: -1, credits: 2 }),
      choice('Cut the task in half for the retake', { credits: 1, supportTokens: 1 }),
    ]),
    card('Mistake museum', 'What helps players see mistakes as normal?', 'reflection', [
      choice('Share one mistake everyone has made before', { credits: 2 }),
      choice('Collect a lesson from the mistake and move on', { credits: 1 }),
    ]),
    card('Action cue', 'Which response keeps a mistake from turning into panic?', 'challenge', [
      choice('Give them one action cue only', { credits: 2 }),
      choice('Use Slow Down if the cue still feels too big', { supportTokens: 1, credits: 1 }),
    ]),
    card('Learning montage', 'How do you show that improvement is happening across retries?', 'opportunity', [
      choice('Point out one thing that got easier', { credits: 2 }),
      choice('Celebrate the effort to stay with the task', { credits: 1, supportTokens: 1 }),
    ]),
    card('Wrap the take', 'The lesson from the mistake is clear. What comes next?', 'opportunity', [
      choice('Return to the goal with confidence', { credits: 2 }),
      choice('Write down the lesson for next time', { credits: 1 }),
    ]),
    card('Second take strength', 'Which response turns a rough first try into visible learning?', 'challenge', [
      choice('Name what changed on the second try', { credits: 2 }),
      choice('Keep the retake small and celebrate the adjustment', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('litmus-strip', [
    card('Make it relevant', 'Which passion can make the work feel more meaningful?', 'opportunity', [
      choice('Connect the task to a favorite interest', { credits: 2 }),
      choice('Promise a joyful reward after the step', { supportTokens: 1, credits: 1 }),
    ]),
    card('Personal spark', 'How do you make this session feel like it belongs to the learner?', 'reflection', [
      choice('Let them choose the example', { credits: 1, supportTokens: 1 }),
      choice('Use a passion-based comparison', { credits: 2 }),
    ]),
    card('Motivation bridge', 'What connects this work to something they already care about?', 'reflection', [
      choice('Compare the task to a familiar hobby', { credits: 2 }),
      choice('Ask what success would unlock for them', { credits: 1, supportTokens: 1 }),
    ]),
    card('Reward planning', 'Which reward keeps the mood light without taking over the goal?', 'opportunity', [
      choice('Promise a small celebration after one step', { credits: 1, supportTokens: 1 }),
      choice('Use the reward as a finish-line marker', { credits: 2 }),
    ]),
    card('Interest hook', 'How do you hook attention at the start of a hard turn?', 'challenge', [
      choice('Begin with an example they actually enjoy', { credits: 2 }),
      choice('Ask what part feels most relatable first', { credits: 1 }),
    ]),
    card('Passion pause', 'Energy is dropping. What helps restore it?', 'opportunity', [
      choice('Take a quick passion-based reset', { supportTokens: 1, credits: 1 }),
      choice('Swap in a more relevant example', { credits: 2 }),
    ]),
    card('Meaning first', 'What helps a task feel worth doing?', 'reflection', [
      choice('Show how the task connects to their real world', { credits: 2 }),
      choice('Let them explain why it matters to them', { credits: 1 }),
    ]),
    card('Choose the angle', 'Which teaching angle gives the learner more ownership?', 'opportunity', [
      choice('Offer two passion-based examples and let them pick', { credits: 2 }),
      choice('Let them invent the example with the team', { credits: 1, supportTokens: 1 }),
    ]),
    card('Relevant reward', 'How do you keep a reward supportive instead of distracting?', 'challenge', [
      choice('Make the reward small and connected to effort', { credits: 2 }),
      choice('Use the reward only after the next checkpoint', { credits: 1 }),
    ]),
    card('Bring your passion', 'What can the helper contribute to make the session warmer?', 'reflection', [
      choice('Share your own enthusiasm in a useful way', { credits: 2 }),
      choice('Ask the learner what would make this more interesting', { credits: 1, supportTokens: 1 }),
    ]),
    card('Interest remix', 'The current example is flat. What should the team do?', 'challenge', [
      choice('Remix it with an interest the learner named', { credits: 2 }),
      choice('Slow down and invite them to pick a better example', { supportTokens: 1, credits: 1 }),
    ]),
    card('Relevant finish', 'What ending helps motivation carry into the next session?', 'opportunity', [
      choice('End by naming what felt most meaningful', { credits: 2 }),
      choice('Save one passion-based example for next time', { credits: 1 }),
    ]),
    card('Passion anchor', 'Which response uses interest to steady a difficult turn?', 'reflection', [
      choice('Anchor the task in a topic the learner already lights up about', { credits: 2 }),
      choice('Let the learner rename the example in their own style', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('heart', [
    card('Confidence check', 'A worried thought appears. What should the team do?', 'reflection', [
      choice('Replace it with one true strength', { credits: 1, supportTokens: 1 }),
      choice('Remind them of an earlier win', { credits: 2 }),
    ]),
    card('You can do it', 'Choose the response that builds confidence without pressure.', 'opportunity', [
      choice('Praise effort and the next step', { credits: 2 }),
      choice('Offer calm support and a break', { supportTokens: 1, credits: 1 }),
    ]),
    card('Rewrite the story', 'A player says "I am bad at this." What helps most?', 'challenge', [
      choice('Change it to "I am still learning this."', { credits: 2 }),
      choice('Name one thing they handled well already', { credits: 1, supportTokens: 1 }),
    ]),
    card('Steady heart', 'What keeps encouragement from sounding fake?', 'reflection', [
      choice('Point to a real effort you noticed', { credits: 2 }),
      choice('Offer one truthful compliment and one next step', { credits: 1 }),
    ]),
    card('Courage moment', 'The learner wants to quit. What does Amber suggest?', 'challenge', [
      choice('Stay for one more tiny try', { credits: 2 }),
      choice('Use support to make the next step lighter', { supportTokens: -1, credits: 1 }),
    ]),
    card('Strength reminder', 'Which response helps confidence grow over time?', 'opportunity', [
      choice('Collect small proofs of progress', { credits: 2 }),
      choice('Have the learner say what they did well', { credits: 1 }),
    ]),
    card('Kind voice', 'How can the team model a kinder inner voice?', 'reflection', [
      choice('Use calm words that leave room for learning', { credits: 2 }),
      choice('Invite them to talk to themselves like a friend', { credits: 1, supportTokens: 1 }),
    ]),
    card('Heart reset', 'What helps after a discouraging moment?', 'challenge', [
      choice('Name the feeling and keep one next step visible', { credits: 2 }),
      choice('Use Slow Down to calm the moment first', { supportTokens: 1, credits: 1 }),
    ]),
    card('Quiet bravery', 'Which action honors effort even when confidence is shaky?', 'opportunity', [
      choice('Celebrate that they stayed with the task', { credits: 2 }),
      choice('Offer a team nod before the next try', { credits: 1, supportTokens: 1 }),
    ]),
    card('Hope handoff', 'How do helpers pass encouragement without overtalking?', 'reflection', [
      choice('Let one helper speak and others echo support', { credits: 2 }),
      choice('Ask the learner what encouragement helps most', { credits: 1 }),
    ]),
    card('Heart spotlight', 'What helps a learner notice their own progress?', 'opportunity', [
      choice('Point out one hard thing they handled today', { credits: 2 }),
      choice('Have them record a proud moment', { credits: 1, supportTokens: 1 }),
    ]),
    card('Confidence carryover', 'How can this session leave courage for next time?', 'reflection', [
      choice('End with one sentence of earned confidence', { credits: 2 }),
      choice('Write down what felt less scary than before', { credits: 1 }),
    ]),
    card('Heart proof', 'What kind of encouragement feels strongest right now?', 'reflection', [
      choice('Point to one real thing they handled better than before', { credits: 2 }),
      choice('Remind them they do not have to feel ready to keep trying', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('stop-sign', [
    card('Slow it down', 'The learner freezes. What is the most helpful move?', 'challenge', [
      choice('Take one breath and one tiny step', { supportTokens: 1, credits: 1 }),
      choice('Pause the pressure and reset the pace', { supportTokens: 2 }),
    ]),
    card('Gentle pacing', 'What keeps this turn from feeling rushed?', 'reflection', [
      choice('Shrink the task to one simple action', { credits: 1, supportTokens: 1 }),
      choice('Give them quiet time to think', { supportTokens: 2 }),
    ]),
    card('Red light reset', 'The pace is too fast. What should happen first?', 'challenge', [
      choice('Stop and remove one demand', { supportTokens: 1, credits: 1 }),
      choice('Ask what would make the turn feel calmer', { credits: 2 }),
    ]),
    card('Breathing room', 'What helps a stuck player re-enter the turn?', 'reflection', [
      choice('Give them time before speaking again', { supportTokens: 2 }),
      choice('Offer one calm sentence and one option', { credits: 1, supportTokens: 1 }),
    ]),
    card('Unfreeze plan', 'Which response makes a frozen moment feel survivable?', 'challenge', [
      choice('Choose the smallest possible next action', { credits: 2 }),
      choice('Use support and let Amber guide the reset', { supportTokens: -1, credits: 1 }),
    ]),
    card('Pace partner', 'How can the team keep from rushing the learner?', 'reflection', [
      choice('Match the pace to their thinking time', { credits: 2 }),
      choice('Let one helper count out a calm pause', { supportTokens: 1 }),
    ]),
    card('No hurry', 'What message should the team send during a tense turn?', 'opportunity', [
      choice('There is time to do this carefully', { credits: 2 }),
      choice('It is okay to take a slower route', { supportTokens: 1, credits: 1 }),
    ]),
    card('Pause without quitting', 'How do you slow down without losing momentum entirely?', 'challenge', [
      choice('Pause only long enough to choose the next step', { credits: 2 }),
      choice('Spend support to end the pressure and return next turn', { supportTokens: -1, credits: 1 }),
    ]),
    card('Traffic check', 'What sign tells you the pace is becoming too much?', 'reflection', [
      choice('The learner stops knowing where to begin', { credits: 2 }),
      choice('The team starts giving too many directions', { credits: 1 }),
    ]),
    card('Slow success', 'Which response treats calm progress as real progress?', 'opportunity', [
      choice('Celebrate careful work even if it is slower', { credits: 2 }),
      choice('Mark the step as done and keep the tempo gentle', { credits: 1, supportTokens: 1 }),
    ]),
    card('Lower the pressure', 'The room feels tense. What should Amber suggest?', 'challenge', [
      choice('Simplify the turn and lower the pressure', { credits: 2 }),
      choice('Offer a Slow Down reset right away', { supportTokens: 1, credits: 1 }),
    ]),
    card('Safe speed', 'How does the team carry a calmer pace into later turns?', 'reflection', [
      choice('Remember that calm is part of success', { credits: 2 }),
      choice('Write down the pace that worked today', { credits: 1 }),
    ]),
    card('Pause point', 'Which response helps everyone slow down before stress spills over?', 'challenge', [
      choice('Call a pause and choose just one next action', { credits: 2, supportTokens: 1 }),
      choice('Let Amber reset the pace with a calmer turn plan', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('target', [
    card('SMART check', 'Which choice makes the goal more concrete?', 'reflection', [
      choice('Define when and how to finish it', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Choose one measurable checkpoint', { credits: 1, milestone: 'smartCheckComplete' }),
    ]),
    card('Aim together', 'How does the team check whether progress is real?', 'opportunity', [
      choice('Compare today to the last session', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Write the next checkpoint on paper', { credits: 1, supportTokens: 1, milestone: 'smartCheckComplete' }),
    ]),
    card('Checkpoint board', 'What helps the learner see progress clearly?', 'reflection', [
      choice('Mark one checkpoint at a time', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Use a simple progress list with boxes', { credits: 1 }),
    ]),
    card('Specific target', 'Which response keeps the goal from getting too vague?', 'challenge', [
      choice('Add one number, time, or clear finish line', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Ask the team to define "done" together', { credits: 1, supportTokens: 1 }),
    ]),
    card('Measure what matters', 'How do you tell whether the learner is closer than before?', 'reflection', [
      choice('Compare one concrete skill or step', { credits: 2 }),
      choice('Use a before-and-after example', { credits: 1, milestone: 'smartCheckComplete' }),
    ]),
    card('On-target plan', 'What makes the next step feel both useful and reachable?', 'opportunity', [
      choice('Pick a step that fits this session', { credits: 2 }),
      choice('Choose a smaller checkpoint with support', { credits: 1, supportTokens: 1 }),
    ]),
    card('Realistic route', 'The goal is too big for today. What keeps it SMART?', 'challenge', [
      choice('Trim the goal to a realistic slice', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Rename the big goal as a long-term target', { credits: 1 }),
    ]),
    card('Timed focus', 'What helps the learner know when the step is complete?', 'reflection', [
      choice('Set a clear end point for the turn', { credits: 2 }),
      choice('Set one checkpoint before the break', { credits: 1, supportTokens: 1 }),
    ]),
    card('Progress proof', 'Which response builds trust in the process?', 'opportunity', [
      choice('Show evidence that the goal moved forward', { credits: 2 }),
      choice('Let the learner explain the improvement', { credits: 1 }),
    ]),
    card('Target tune-up', 'A goal is drifting. What should the team do?', 'challenge', [
      choice('Tune the goal so it becomes specific again', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Add one measurable step before rolling on', { credits: 1 }),
    ]),
    card('Between-session plan', 'What makes progress more likely after the game ends?', 'opportunity', [
      choice('Choose one action for between sessions', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Write a reminder the learner can actually use', { credits: 1, supportTokens: 1 }),
    ]),
    card('Bullseye review', 'How does Amber help the group notice real growth?', 'reflection', [
      choice('Ask what feels easier than last time', { credits: 2 }),
      choice('Highlight one target they already hit', { credits: 1 }),
    ]),
    card('Target line', 'Which response makes the next checkpoint easiest to measure?', 'opportunity', [
      choice('Choose a checkpoint that can be seen or counted today', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Turn a vague hope into a clear next target', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('happy-face', [
    card('Keep spirits up', 'How does the team protect joy during a hard moment?', 'opportunity', [
      choice('Celebrate one small win right now', { credits: 2 }),
      choice('Invite a lighthearted reset', { supportTokens: 1, credits: 1 }),
    ]),
    card('Joy is fuel', 'Choose the action that helps the learner keep going.', 'reflection', [
      choice('Point out progress they may have missed', { credits: 2 }),
      choice('Let them choose a cheerful reset', { supportTokens: 1, credits: 1 }),
    ]),
    card('Smile break', 'What kind of fun helps without pulling focus away?', 'opportunity', [
      choice('Take a quick joyful breath and return', { credits: 1, supportTokens: 1 }),
      choice('Celebrate the next finished step', { credits: 2 }),
    ]),
    card('Lighten the room', 'The mood is getting heavy. What should happen?', 'reflection', [
      choice('Use one warm, encouraging joke', { credits: 2 }),
      choice('Share a happy memory of past progress', { credits: 1 }),
    ]),
    card('Mood helper', 'How can the team support feelings while still moving forward?', 'opportunity', [
      choice('Check in on feelings and keep one task visible', { credits: 2 }),
      choice('Use support to soften the tone of the turn', { supportTokens: -1, credits: 1 }),
    ]),
    card('Celebrate effort', 'What deserves celebration even before the goal is finished?', 'reflection', [
      choice('Staying with the task', { credits: 2 }),
      choice('Trying again after a setback', { credits: 1, supportTokens: 1 }),
    ]),
    card('Cheerful checkpoint', 'How does the group keep momentum playful?', 'opportunity', [
      choice('Add a little celebration after each checkpoint', { credits: 2 }),
      choice('Let the active player choose the celebration', { credits: 1 }),
    ]),
    card('Mood recovery', 'A turn felt discouraging. What brings energy back best?', 'challenge', [
      choice('Name one thing that still went well', { credits: 2 }),
      choice('Use support to change the mood before the next step', { supportTokens: -1, credits: 1 }),
    ]),
    card('Just because joy', 'What helps the game feel warm even without a big win?', 'reflection', [
      choice('Share one thing that made the team smile today', { credits: 2 }),
      choice('Let the group pause for a cheerful moment', { credits: 1 }),
    ]),
    card('Friendly finish', 'How does the team end a turn on a positive note?', 'opportunity', [
      choice('Name one helpful thing each player did', { credits: 2 }),
      choice('Give the active player a joyful send-off', { credits: 1, supportTokens: 1 }),
    ]),
    card('Spirit shield', 'What helps protect morale when a challenge card lands?', 'challenge', [
      choice('Remind the team that hard turns do not last forever', { credits: 2 }),
      choice('Use a quick joy reset before retrying', { credits: 1, supportTokens: 1 }),
    ]),
    card('Happy carryover', 'How can the session end with good energy still intact?', 'reflection', [
      choice('End with one moment of shared pride', { credits: 2 }),
      choice('Choose one happy thing to bring to next time', { credits: 1 }),
    ]),
    card('Joy rebound', 'Which response lifts the mood without breaking focus?', 'opportunity', [
      choice('Use a quick smile moment, then return to the next step', { credits: 2 }),
      choice('Let the learner pick the celebration after the checkpoint', { credits: 1, supportTokens: 1 }),
    ]),
  ]),
  ...buildCards('star', [
    card('Dream check-in', 'How can the team keep the learner connected to what they really want?', 'reflection', [
      choice('Name the goal and why it matters today', { credits: 2, milestone: 'goalDefined' }),
      choice('Pick one smaller version of the dream for this turn', { credits: 1, supportTokens: 1 }),
    ]),
    card('Goal ladder', 'Which move helps a big hope feel climbable?', 'opportunity', [
      choice('Turn the goal into three short steps', { credits: 2, milestone: 'goalDefined' }),
      choice('Choose the easiest first rung and start there', { credits: 1 }),
    ]),
    card('Wishes into work', 'What keeps a wish from staying only a wish?', 'challenge', [
      choice('Choose one action that proves the goal is active', { credits: 2 }),
      choice('Ask the group to help shape the first step', { credits: 1, supportTokens: 1, milestone: 'goalDefined' }),
    ]),
    card('Star compass', 'The learner has many ideas. What gives the clearest direction?', 'reflection', [
      choice('Choose the goal that matters most right now', { credits: 2, milestone: 'goalDefined' }),
      choice('Circle one goal for now and save the others for later', { credits: 1 }),
    ]),
    card('Hope with a plan', 'Which response turns hope into visible progress?', 'opportunity', [
      choice('Say the goal and the next step together', { credits: 2 }),
      choice('Write a goal note the learner can check after this turn', { credits: 1, supportTokens: 1 }),
    ]),
    card('Future snapshot', 'What helps the learner picture success without feeling overwhelmed?', 'reflection', [
      choice('Describe one clear moment when the goal is done', { credits: 2, milestone: 'goalDefined' }),
      choice('Picture only the next checkpoint instead of the whole journey', { credits: 1 }),
    ]),
    card('Guiding wish', 'Which action keeps the session pointed at the right star?', 'challenge', [
      choice('Trim away side tasks and protect the main goal', { credits: 2 }),
      choice('Ask Amber to restate the goal in simpler words', { credits: 1, supportTokens: 1, milestone: 'goalDefined' }),
    ]),
  ], 14),
  ...buildCards('circles', [
    card('Helping hands', 'How can the team make support feel natural instead of awkward?', 'reflection', [
      choice('Offer one clear help option and let the learner choose', { credits: 2, milestone: 'supportShared' }),
      choice('Ask which teammate feels easiest to accept help from', { credits: 1, supportTokens: 1 }),
    ]),
    card('Shared push', 'A player is slowing down. What keeps the table moving together?', 'opportunity', [
      choice('Spend support and help them finish the next piece', { credits: 2, supportTokens: -1, teamAssist: true }),
      choice('Pair them with one calm helper for this turn', { credits: 1, milestone: 'supportShared' }),
    ]),
    card('Team check', 'What helps everyone stay aware of who needs support most?', 'reflection', [
      choice('Pause and ask who feels stuck right now', { credits: 2 }),
      choice('Have each player name one support move they can offer', { credits: 1, supportTokens: 1 }),
    ]),
    card('Circle signal', 'How do you make it easier for someone to ask for help?', 'challenge', [
      choice('Normalize asking before frustration grows', { credits: 2, milestone: 'supportShared' }),
      choice('Offer a support token as a calm invitation', { credits: 1, supportTokens: 1 }),
    ]),
    card('Catch-up partner', 'Which move best protects a player from being left behind?', 'opportunity', [
      choice('Choose one helper and one tiny shared task', { credits: 2, milestone: 'supportShared' }),
      choice('Spend support so the next step feels lighter', { credits: 1, supportTokens: -1, teamAssist: true }),
    ]),
    card('Circle promise', 'What kind of promise keeps teamwork real?', 'reflection', [
      choice('Promise that no one will stay stuck alone', { credits: 2, supportTokens: 1 }),
      choice('Promise to ask before stepping in with help', { credits: 1, milestone: 'supportShared' }),
    ]),
    card('Support relay', 'How does the team keep support going when one helper needs to step back?', 'challenge', [
      choice('Pass the support smoothly with a quick summary', { credits: 2 }),
      choice('Let the learner choose the next helper in line', { credits: 1, supportTokens: 1, milestone: 'supportShared' }),
    ]),
  ], 14),
  ...buildCards('clapperboard', [
    card('Try it again', 'What makes another attempt feel useful instead of discouraging?', 'challenge', [
      choice('Keep the retry focused on one fix only', { credits: 2 }),
      choice('Use support to soften the pressure around the retry', { credits: 1, supportTokens: 1 }),
    ]),
    card('Scene reset', 'A mistake happened fast. What should the team do next?', 'reflection', [
      choice('Slow down and replay the tricky part clearly', { credits: 2 }),
      choice('Name what worked before the mistake showed up', { credits: 1 }),
    ]),
    card('Action replay', 'How do you help the learner notice what changed on the next try?', 'opportunity', [
      choice('Point out one improvement immediately', { credits: 2 }),
      choice('Let the learner explain what they changed', { credits: 1, supportTokens: 1 }),
    ]),
    card('Retake note', 'What kind of feedback helps the next attempt most?', 'challenge', [
      choice('Give one short note they can use right away', { credits: 2 }),
      choice('Model the change and let them copy the rhythm', { credits: 1 }),
    ]),
    card('Miss to method', 'How can a mistake become part of the lesson?', 'reflection', [
      choice('Treat the mistake like a clue about what to teach next', { credits: 2 }),
      choice('Save the mistake as an example for the next turn', { credits: 1, supportTokens: 1 }),
    ]),
    card('Cut and retry', 'The current task is too messy. What is the strongest move?', 'challenge', [
      choice('Cut the task into a smaller retake', { credits: 2 }),
      choice('Pause and choose the single hardest part to retry', { credits: 1 }),
    ]),
    card('Learning take', 'What helps the learner stay brave after an imperfect try?', 'opportunity', [
      choice('Celebrate the fact that they stayed in the scene', { credits: 2 }),
      choice('Remind them that good learning includes retakes', { credits: 1, supportTokens: 1 }),
    ]),
  ], 14),
  ...buildCards('litmus-strip', [
    card('Interest bridge', 'What helps the work feel connected to the learner’s real interests?', 'reflection', [
      choice('Use their favorite topic as the example', { credits: 2 }),
      choice('Ask what part of the task feels most relevant', { credits: 1, supportTokens: 1 }),
    ]),
    card('Passion spark', 'How can the helper raise energy at the start of a hard turn?', 'opportunity', [
      choice('Lead with a passion-based hook', { credits: 2 }),
      choice('Offer a small reward after one checkpoint', { credits: 1, supportTokens: 1 }),
    ]),
    card('Relevant route', 'Which move makes the lesson feel less abstract?', 'challenge', [
      choice('Compare it to something the learner already knows well', { credits: 2 }),
      choice('Let the learner choose the example the team uses', { credits: 1 }),
    ]),
    card('Reward lens', 'How do you use a reward without letting it take over the session?', 'reflection', [
      choice('Tie the reward to one clear piece of effort', { credits: 2 }),
      choice('Keep the reward small and easy to earn honestly', { credits: 1, supportTokens: 1 }),
    ]),
    card('Passion handoff', 'What helps a helper use enthusiasm in a way that stays useful?', 'opportunity', [
      choice('Share excitement, then point it back to the task', { credits: 2 }),
      choice('Invite the learner to explain why the topic matters to them', { credits: 1 }),
    ]),
    card('Meaning marker', 'Which response makes today’s work feel worth doing?', 'reflection', [
      choice('Show how this step connects to a real goal outside the game', { credits: 2 }),
      choice('Ask what success here would unlock later', { credits: 1, supportTokens: 1 }),
    ]),
    card('Motivation remix', 'Energy is flat. What should the team try?', 'challenge', [
      choice('Remix the task with a more personal example', { credits: 2 }),
      choice('Swap in a short reward checkpoint to restart momentum', { credits: 1, supportTokens: 1 }),
    ]),
  ], 14),
  ...buildCards('heart', [
    card('Story shift', 'What helps a learner replace a discouraging story with a stronger one?', 'reflection', [
      choice('Name one true sign of growth they already showed', { credits: 2 }),
      choice('Give them a calmer sentence to say to themselves', { credits: 1, supportTokens: 1 }),
    ]),
    card('Confidence spark', 'How does the team help confidence grow without overpromising?', 'opportunity', [
      choice('Praise the effort and the exact progress made', { credits: 2 }),
      choice('Remind them of one earlier success that still counts', { credits: 1 }),
    ]),
    card('Gentle rewrite', 'A learner starts talking down to themselves. What is the best response?', 'challenge', [
      choice('Help them rewrite the thought in kinder words', { credits: 2 }),
      choice('Ask what they would say to a friend in the same moment', { credits: 1, supportTokens: 1 }),
    ]),
    card('Heart reminder', 'What kind of encouragement feels most believable?', 'reflection', [
      choice('Point to one real strength you saw today', { credits: 2 }),
      choice('Celebrate that they stayed with the hard part', { credits: 1 }),
    ]),
    card('Courage track', 'How can the team notice confidence building over time?', 'opportunity', [
      choice('Collect small brave moments as proof', { credits: 2 }),
      choice('Have the learner name what feels easier than before', { credits: 1, supportTokens: 1 }),
    ]),
    card('Steady belief', 'What helps after a learner says they cannot do it?', 'challenge', [
      choice('Shrink the task and protect one successful try', { credits: 2 }),
      choice('Offer calm support while they choose the next step', { credits: 1, supportTokens: 1 }),
    ]),
    card('New story line', 'Which move helps confidence carry into the next session?', 'reflection', [
      choice('End with a sentence about what they can do now', { credits: 2 }),
      choice('Write down one stronger belief to return to later', { credits: 1 }),
    ]),
  ], 14),
  ...buildCards('stop-sign', [
    card('Freeze check', 'A learner is shutting down. What should happen first?', 'challenge', [
      choice('Pause and reduce the number of demands', { credits: 2, supportTokens: 1 }),
      choice('Give them one tiny action and quiet space', { credits: 1 }),
    ]),
    card('Slower lane', 'How does the team show that a calmer pace is acceptable?', 'reflection', [
      choice('Say that careful progress still counts', { credits: 2 }),
      choice('Match the pace to the learner instead of the clock', { credits: 1, supportTokens: 1 }),
    ]),
    card('Pause signal', 'What helps everyone notice when the pace has become too much?', 'reflection', [
      choice('Watch for confusion before it becomes panic', { credits: 2 }),
      choice('Ask directly if the pace needs to slow down', { credits: 1 }),
    ]),
    card('Reset breath', 'Which move best helps a tense turn settle?', 'opportunity', [
      choice('Take a short pause, then return to one next step', { credits: 2 }),
      choice('Use a calm check-in before giving more direction', { credits: 1, supportTokens: 1 }),
    ]),
    card('Careful tempo', 'What keeps the learner from feeling rushed through the task?', 'challenge', [
      choice('Reduce the task to one manageable action', { credits: 2 }),
      choice('Let Amber guide a slower turn plan', { credits: 1, supportTokens: 1 }),
    ]),
    card('Space to think', 'How does the team protect thinking time?', 'reflection', [
      choice('Let silence do some of the helping', { credits: 2 }),
      choice('Have one helper speak while others wait', { credits: 1 }),
    ]),
    card('Calm checkpoint', 'Which response keeps a slow turn from feeling like failure?', 'opportunity', [
      choice('Mark calm progress as real progress', { credits: 2 }),
      choice('Celebrate one careful step before moving on', { credits: 1, supportTokens: 1 }),
    ]),
  ], 14),
  ...buildCards('target', [
    card('Closer than before', 'How can the team tell whether the learner is moving toward the star?', 'reflection', [
      choice('Compare today’s work to the last session clearly', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Point to one checkpoint already completed', { credits: 1 }),
    ]),
    card('SMART bridge', 'What helps a goal stay useful between sessions?', 'opportunity', [
      choice('Set one specific action for after the game', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Write a realistic reminder they can actually follow', { credits: 1, supportTokens: 1 }),
    ]),
    card('Target review', 'Which response sharpens a goal that has become fuzzy?', 'challenge', [
      choice('Make the next checkpoint measurable again', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Choose one clearer version of the same goal', { credits: 1 }),
    ]),
    card('Next checkpoint', 'How does the team keep progress visible?', 'reflection', [
      choice('Choose one checkpoint that can be counted today', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Use a simple before-and-after comparison', { credits: 1 }),
    ]),
    card('Aim after today', 'What helps progress continue after this session ends?', 'opportunity', [
      choice('Plan one action for the learner to do later', { credits: 2 }),
      choice('Set a small between-session check-in target', { credits: 1, supportTokens: 1, milestone: 'smartCheckComplete' }),
    ]),
    card('Bullseye step', 'Which move keeps the next action realistic and clear?', 'challenge', [
      choice('Set a target that fits the time you actually have', { credits: 2, milestone: 'smartCheckComplete' }),
      choice('Trim the task until the finish line is obvious', { credits: 1 }),
    ]),
    card('Measure forward', 'What helps the learner notice that they are closer than before?', 'reflection', [
      choice('Show one concrete sign of progress', { credits: 2 }),
      choice('Ask them to explain what moved forward today', { credits: 1, supportTokens: 1 }),
    ]),
  ], 14),
  ...buildCards('happy-face', [
    card('Lift the mood', 'How can the team keep the room light while still helping?', 'opportunity', [
      choice('Celebrate a small win and keep going', { credits: 2 }),
      choice('Offer a quick cheerful reset before the next task', { credits: 1, supportTokens: 1 }),
    ]),
    card('Joy marker', 'What helps a learner notice the good in a hard session?', 'reflection', [
      choice('Point out one thing that felt better than before', { credits: 2 }),
      choice('Let them choose a happy moment to remember', { credits: 1 }),
    ]),
    card('Smile support', 'How does the team protect morale without becoming distracting?', 'challenge', [
      choice('Use one brief joy moment, then return to the goal', { credits: 2 }),
      choice('Pair encouragement with one clear next step', { credits: 1, supportTokens: 1 }),
    ]),
    card('Bright break', 'The energy feels heavy. What should happen?', 'opportunity', [
      choice('Take a short warm reset and come back together', { credits: 2 }),
      choice('Let the active player choose a tiny celebration first', { credits: 1 }),
    ]),
    card('Good feeling carry', 'What helps positive energy last into the next turn?', 'reflection', [
      choice('Name what the team did well together', { credits: 2 }),
      choice('Save one cheerful moment to remember later', { credits: 1, supportTokens: 1 }),
    ]),
    card('Mood anchor', 'Which response helps when tension starts to affect the whole table?', 'challenge', [
      choice('Bring the group back with one warm encouraging note', { credits: 2 }),
      choice('Use a light reset before returning to the task', { credits: 1, supportTokens: 1 }),
    ]),
    card('Happy momentum', 'How can joy help the learner keep moving instead of stopping?', 'opportunity', [
      choice('Turn success into a small shared celebration', { credits: 2 }),
      choice('Let the learner pick the cheerful reward after the checkpoint', { credits: 1 }),
    ]),
  ], 14),
]

export const miniChallenges: MiniChallenge[] = [
  ...buildChallenges('star', [
    challenge('Which goal is the clearest for this session?', ['I want to feel better.', 'I will finish one practice problem before lunch.', 'Maybe I will try something later.'], 1, { credits: 2, milestone: 'goalDefined' }, { credits: 1 }),
    challenge('Which next step is most useful?', ['Do everything at once.', 'Pick one small action you can finish today.', 'Wait for the perfect moment.'], 1, { credits: 2 }, { credits: 1 }),
  ]),
  ...buildChallenges('circles', [
    challenge('What is the best first support move when someone is stuck?', ['Take over the whole task for them.', 'Ask what kind of help would feel useful.', 'Ignore it and move on quickly.'], 1, { supportTokens: 2, milestone: 'supportShared' }, { supportTokens: 1 }),
    challenge('Which response keeps the game cooperative?', ['Help the player who is furthest behind.', 'Only help the strongest player.', 'Save all support until the end.'], 0, { credits: 2, supportTokens: 1 }, { credits: 1 }),
  ]),
  ...buildChallenges('clapperboard', [
    challenge('What is the healthiest response to a mistake?', ['Hide it and move on.', 'Notice it, learn from it, and try again.', 'Blame the player.'], 1, { credits: 2 }, { credits: 1 }),
    challenge('What helps a retry feel safer?', ['Add more pressure.', 'Shrink the task and keep one clear cue.', 'Tell everyone to hurry.'], 1, { credits: 2, supportTokens: 1 }, { credits: 1 }),
  ]),
  ...buildChallenges('litmus-strip', [
    challenge('Which choice makes work feel more relevant?', ['Use an example the learner cares about.', 'Ignore their interests.', 'Only repeat the directions louder.'], 0, { credits: 2 }, { credits: 1 }),
    challenge('What is the best kind of reward?', ['A small reward that follows real effort.', 'A reward with no connection to effort.', 'A reward that replaces the whole task.'], 0, { credits: 2, supportTokens: 1 }, { credits: 1 }),
  ]),
  ...buildChallenges('heart', [
    challenge('Which response builds confidence best?', ['You should know this already.', 'Let us remember one thing you can already do.', 'If you rush, it will be fine.'], 1, { credits: 2 }, { credits: 1 }),
    challenge('What keeps encouragement honest?', ['Praise everything vaguely.', 'Point to one real strength or effort.', 'Say nothing helpful at all.'], 1, { credits: 2, supportTokens: 1 }, { credits: 1 }),
  ]),
  ...buildChallenges('stop-sign', [
    challenge('What helps when the brain starts to freeze?', ['Slow down and choose one tiny next action.', 'Add three more directions at once.', 'Skip the turn without checking in.'], 0, { supportTokens: 2 }, { supportTokens: 1 }),
    challenge('What is a good Slow Down move?', ['Lower the pressure and reset the pace.', 'Rush through the hard part.', 'Talk faster.'], 0, { credits: 1, supportTokens: 2 }, { supportTokens: 1 }),
  ]),
  ...buildChallenges('target', [
    challenge('Which goal sounds most SMART?', ['I will do better soon.', 'I will finish two practice questions before dinner.', 'I might try something later.'], 1, { credits: 2, milestone: 'smartCheckComplete' }, { credits: 1 }),
    challenge('Which checkpoint is most measurable?', ['Work harder somehow.', 'Complete one example and check the answer.', 'Hope it gets easier.'], 1, { credits: 2, milestone: 'smartCheckComplete' }, { credits: 1 }),
  ]),
  ...buildChallenges('happy-face', [
    challenge('What helps morale most during a hard turn?', ['Celebrate one small win.', 'Pretend nothing feels hard.', 'Criticize the slow pace.'], 0, { credits: 2 }, { credits: 1 }),
    challenge('What is the best joyful reset?', ['A brief, warm moment that returns to the goal.', 'A distraction that ends the whole session.', 'More pressure and no break.'], 0, { credits: 2, supportTokens: 1 }, { credits: 1 }),
  ]),
]

function buildCards(
  symbolType: SymbolType,
  seeds: CardSeed[],
  startIndex = 1,
): SymbolCard[] {
  return seeds.map((seed, index) => ({
    ...seed,
    id: `${symbolType}-${String(startIndex + index).padStart(3, '0')}`,
    symbolType,
  }))
}

function buildChallenges(symbolType: SymbolType, seeds: ChallengeSeed[]): MiniChallenge[] {
  return seeds.map((seed, index) => ({
    ...seed,
    id: `${symbolType}-challenge-${String(index + 1).padStart(3, '0')}`,
    symbolType,
  }))
}

function card(title: string, prompt: string, kind: SymbolCard['kind'], choices: CardChoice[]): CardSeed {
  return { title, prompt, kind, choices }
}

function choice(label: string, outcome: CardOutcome): CardChoice {
  return {
    id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    label,
    outcome,
  }
}

function challenge(
  prompt: string,
  options: string[],
  correctIndex: number,
  successOutcome: CardOutcome,
  fallbackOutcome: CardOutcome,
): ChallengeSeed {
  return {
    prompt,
    options,
    correctIndex,
    successOutcome,
    fallbackOutcome,
  }
}
