import type { Command } from '../types/Command.ts';
import { DailyCommand } from '../commands/general/daily.ts';
import { IntroductionCommand } from '../commands/general/introduction.ts';

const commands: Map<string, Command> = new Map();

commands.set(DailyCommand.data.name, DailyCommand);
commands.set(IntroductionCommand.data.name, IntroductionCommand);
export default commands;