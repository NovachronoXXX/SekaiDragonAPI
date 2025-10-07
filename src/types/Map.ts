import type { Command } from '../types/Command.ts';
import { DailyCommand } from '../commands/general/daily.ts';
import { IntroductionCommand } from '../commands/general/introduction.ts';
import { InventoryCommand } from '../commands/general/inventory.ts';

const commands: Map<string, Command> = new Map();

commands.set(DailyCommand.data.name, DailyCommand);
commands.set(IntroductionCommand.data.name, IntroductionCommand);
commands.set(InventoryCommand.data.name, InventoryCommand);

export default commands;